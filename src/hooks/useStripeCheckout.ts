import { useState } from 'react';
import { supabase } from '../lib/supabase';

export function useStripeCheckout() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (
    price: string | { amount: number; name: string },
    mode: 'subscription' | 'payment',
    plan: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      if (!price || (typeof price === 'string' && !price)) {
        throw new Error('Preço ainda não configurado. Contacta o administrador.');
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Precisas de fazer login para continuar.');
      }

      const body = typeof price === 'string'
        ? { priceId: price, mode, plan }
        : { priceData: price, mode, plan };

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar sessão de pagamento.');
      }

      // Redirect the browser to Stripe hosted checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
      setLoading(false);
    }
  };

  return { startCheckout, loading, error };
}
