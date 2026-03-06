// @ts-ignore deno-specific import
import Stripe from 'https://esm.sh/stripe@14.21.0?target=deno';
// @ts-ignore deno-specific import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// @ts-ignore Deno global
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-12-18.acacia',
  // @ts-ignore Deno fetch
  httpClient: Stripe.createFetchHttpClient(),
});

// @ts-ignore Deno global
Deno.serve(async (req: Request) => {
  const signature = req.headers.get('stripe-signature');
  const body = await req.text();

  // @ts-ignore Deno global
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret);
  } catch (err) {
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  // @ts-ignore Deno global
  const supabase = createClient(
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_URL')!,
    // @ts-ignore Deno global
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  // --- Checkout completed: grant access ---
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.CheckoutSession;
    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan || 'mensal';

    if (!userId) {
      return new Response('Missing user ID in metadata', { status: 400 });
    }

    if (session.mode === 'subscription') {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: plan,
          stripe_subscription_id: subscription.id,
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('id', userId);
    }

    if (session.mode === 'payment') {
      // One-time payment (Desafios lifetime)
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: plan,
          stripe_subscription_id: null,
          subscription_end_date: null,
        })
        .eq('id', userId);
    }
  }

  // --- Subscription renewed ---
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice;
    const subscriptionId = invoice.subscription as string;

    if (subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId);
    }
  }

  // --- Subscription cancelled or expired ---
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await supabase
      .from('profiles')
      .update({
        subscription_status: 'inactive',
        subscription_plan: null,
        stripe_subscription_id: null,
        subscription_end_date: null,
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  // --- Subscription updated (e.g. plan change, past_due) ---
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const isActive = subscription.status === 'active';
    await supabase
      .from('profiles')
      .update({
        subscription_status: isActive ? 'active' : subscription.status,
        subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  return new Response('OK', { status: 200 });
});
