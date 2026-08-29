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

// ─── Envio de email da análise premium (via Resend) ──────────────────
interface AnalisePremiumEmail {
  liga: string;
  jogo: string;
  data: string;
  hora: string;
  aposta: string;
  odd: number;
  analise_contexto: string;
  analise_estatisticas_casa: string;
  analise_estatisticas_fora: string;
  analise_conclusao: string;
}

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderAnaliseEmail(a: AnalisePremiumEmail): string {
  const dataFmt = (a.data || '').slice(0, 10).split('-').reverse().join('/');
  return `<!DOCTYPE html>
<html lang="pt">
<body style="margin:0;padding:0;background:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:linear-gradient(135deg,#2563eb,#4f46e5);border-radius:20px;padding:2px;">
      <div style="background:#03091a;border-radius:18px;padding:32px 28px;color:#dbeafe;">
        <p style="margin:0 0 4px;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#60a5fa;font-weight:700;">Análise Premium — Cadete</p>
        <h1 style="margin:0 0 24px;font-size:26px;font-weight:800;color:#ffffff;">${esc(a.jogo)}</h1>

        <div style="display:inline-block;background:rgba(37,99,235,0.12);border:1px solid rgba(59,130,246,0.25);color:#93c5fd;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:6px 14px;border-radius:999px;margin-bottom:20px;">${esc(a.liga)}</div>
        <p style="margin:0 0 24px;color:#93c5fd;font-size:15px;">${dataFmt} às ${esc(a.hora)}</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
          <tr>
            <td width="50%" style="background:#081533;border:1px solid rgba(30,58,138,0.4);border-radius:14px;padding:18px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#60a5fa;font-weight:700;">Aposta</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">${esc(a.aposta)}</p>
            </td>
            <td width="12"></td>
            <td width="50%" style="background:#081533;border:1px solid rgba(30,58,138,0.4);border-radius:14px;padding:18px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#34d399;font-weight:700;">Odd</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">@${Number(a.odd).toFixed(2)}</p>
            </td>
          </tr>
        </table>

        <div style="background:rgba(8,21,51,0.8);border:1px solid rgba(30,58,138,0.4);border-radius:14px;padding:24px;">
          <h2 style="margin:0 0 16px;font-size:18px;font-weight:700;color:#ffffff;">Análise Detalhada</h2>
          <p style="margin:0 0 14px;line-height:1.6;color:#e0e7ff;"><strong style="color:#ffffff;">Contexto:</strong> ${esc(a.analise_contexto)}</p>
          <p style="margin:0 0 14px;line-height:1.6;color:#e0e7ff;"><strong style="color:#ffffff;">Estatísticas Casa:</strong> ${esc(a.analise_estatisticas_casa)}</p>
          <p style="margin:0 0 14px;line-height:1.6;color:#e0e7ff;"><strong style="color:#ffffff;">Estatísticas Fora:</strong> ${esc(a.analise_estatisticas_fora)}</p>
          <p style="margin:0;line-height:1.6;color:#e0e7ff;"><strong style="color:#ffffff;">Conclusão:</strong> ${esc(a.analise_conclusao)}</p>
        </div>

        <p style="margin:24px 0 0;font-size:13px;color:#64748b;line-height:1.6;">Obrigado pela tua compra. Esta análise também está disponível na tua conta em Análises Premium. Aposta com responsabilidade.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function sendAnalisePremiumEmail(to: string, analise: AnalisePremiumEmail): Promise<void> {
  // @ts-ignore Deno global
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) {
    console.error('RESEND_API_KEY não configurada — email da análise premium não enviado.');
    return;
  }
  // @ts-ignore Deno global
  const from = Deno.env.get('PREMIUM_EMAIL_FROM') || 'Cadete <onboarding@resend.dev>';

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: `A tua Análise Premium — ${analise.jogo}`,
        html: renderAnaliseEmail(analise),
      }),
    });
    if (!res.ok) {
      console.error('Falha ao enviar email da análise premium:', res.status, await res.text());
    }
  } catch (err) {
    console.error('Erro ao enviar email da análise premium:', (err as Error).message);
  }
}

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

    if (session.mode === 'payment' && plan === 'analise_premium') {
      // One-time payment for a single premium analysis — record in compras_premium
      const analiseId = session.metadata?.analise_premium_id;
      if (analiseId) {
        await supabase
          .from('compras_premium')
          .insert({
            user_id: userId,
            analise_premium_id: parseInt(analiseId, 10),
            data_compra: new Date().toISOString(),
          });

        // Enviar a análise por email ao comprador
        const [{ data: analise }, { data: profile }] = await Promise.all([
          supabase
            .from('analise_premium')
            .select('liga, jogo, data, hora, aposta, odd, analise_contexto, analise_estatisticas_casa, analise_estatisticas_fora, analise_conclusao')
            .eq('id', parseInt(analiseId, 10))
            .maybeSingle(),
          supabase
            .from('profiles')
            .select('email')
            .eq('id', userId)
            .maybeSingle(),
        ]);

        const email = (profile as { email?: string } | null)?.email
          || session.customer_details?.email
          || undefined;

        if (analise && email) {
          await sendAnalisePremiumEmail(email, analise as AnalisePremiumEmail);
        } else {
          console.error('Análise premium comprada mas email não enviado (dados em falta).', {
            temAnalise: !!analise,
            temEmail: !!email,
          });
        }
      }
    } else if (session.mode === 'payment' && plan === 'abaixo_de_3') {
      // One-time payment for 6 months of access to "Abaixo de 3 é Para Meninos"
      const sixMonthsFromNow = new Date();
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'active',
          subscription_plan: plan,
          stripe_subscription_id: null,
          subscription_end_date: sixMonthsFromNow.toISOString(),
        })
        .eq('id', userId);
    } else if (session.mode === 'payment') {
      // One-time payment (e.g. Desafios lifetime)
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
