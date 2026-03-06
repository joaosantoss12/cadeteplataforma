// @ts-ignore deno-specific import
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
// @ts-ignore deno-specific import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// @ts-ignore Deno global
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia',
  // @ts-ignore Deno fetch
  httpClient: Stripe.createFetchHttpClient(),
});

// @ts-ignore Deno global
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Sem autorização.');
    }

    // @ts-ignore Deno global
    const supabase = createClient(
      // @ts-ignore Deno global
      Deno.env.get('SUPABASE_URL')!,
      // @ts-ignore Deno global
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      throw new Error('Utilizador não autenticado.');
    }

    const { priceId, priceData, mode, plan } = await req.json() as {
      priceId?: string;
      priceData?: { amount: number; name: string; currency?: string };
      mode: 'subscription' | 'payment';
      plan: string;
    };

    if (!priceId && !priceData) {
      throw new Error('Price ID ou dados de preço em falta.');
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, nome')
      .eq('id', user.id)
      .single();

    let customerId: string = profile?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.nome || undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    const origin = req.headers.get('origin') || 'http://localhost:5173';

    const lineItem = priceId
      ? { price: priceId, quantity: 1 }
      : {
          price_data: {
            currency: priceData!.currency || 'eur',
            unit_amount: Math.round(priceData!.amount * 100),
            product_data: { name: priceData!.name },
          },
          quantity: 1,
        };

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [lineItem],
      mode,
      success_url: `${origin}/dashboard?payment=success&plan=${plan}`,
      cancel_url: `${origin}/desafios`,
      metadata: { supabase_user_id: user.id, plan },
    });

    return new Response(
      JSON.stringify({ url: session.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
