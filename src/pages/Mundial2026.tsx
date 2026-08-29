import {
  Trophy,
  Zap,
  Loader2,
  ShieldCheck,
  Globe,
  Calendar,
  Target,
  TrendingUp,
  CheckCircle2,
  Send
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStripeCheckout } from '../hooks/useStripeCheckout';
import { supabase } from '../lib/supabase';

const TELEGRAM_LINK = 'https://t.me/+_E6Ayd35ZLY0NGM8';
const PLAN = 'abaixo_de_3';

export default function AbaixoDe3() {
  const { startCheckout, loading: checkoutLoading, error: checkoutError } = useStripeCheckout();

  const [jaTemAcesso, setJaTemAcesso] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  // Verifica se o utilizador já tem acesso ativo
  useEffect(() => {
    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setCheckingAccess(false); return; }

      const { data } = await supabase
        .from('profiles')
        .select('subscription_status, subscription_plan')
        .eq('id', user.id)
        .single();

      const profile = data as { subscription_status?: string; subscription_plan?: string } | null;
      if (profile?.subscription_status === 'active' && profile?.subscription_plan === PLAN) {
        setJaTemAcesso(true);
      }
      setCheckingAccess(false);
    };
    checkAccess();
  }, []);

  // Ao voltar do Stripe com sucesso, entra logo no grupo
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success' && params.get('plan') === PLAN) {
      setJaTemAcesso(true);
      navigate('/abaixo-de-3', { replace: true });
      window.location.href = TELEGRAM_LINK;
    }
  }, [location.search, navigate]);

  const handleSubscribe = () => {
    startCheckout({ amount: 50, name: 'Abaixo de 3 é Para Meninos — 6 Meses' }, 'payment', PLAN);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">

      {/* Erro de checkout */}
      {checkoutError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm font-medium">
          {checkoutError}
        </div>
      )}

      {/* Cabeçalho da Página Padrão */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
            <Trophy className="w-10 h-10 text-emerald-500" />
            Abaixo de 3 é <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Para Meninos</span>
          </h1>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            O grupo de odds altas do Cadete. Entradas de valor com retornos a sério para quem não tem medo de arriscar.
          </p>
        </div>

        {/* Badge Lateral Informativa */}
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-emerald-500/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Globe className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest">Odds Altas</p>
            <p className="text-lg font-black text-white">Acesso 6 Meses</p>
          </div>
        </div>
      </div>

      {/* Banner Principal de Venda (Estilo Premium) */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-1 shadow-[0_0_40px_rgba(16,185,129,0.25)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden">

          {/* Efeitos de fundo (Blurs) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Esquerda: Informação e Checkout */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Vagas Limitadas
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Se é <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Abaixo de 3</span>, não é para ti
                </h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  Entradas selecionadas com odds altas e potencial de retorno superior. Acesso ao grupo VIP por 6 meses, com análises e alertas em tempo real.
                </p>
              </div>

              <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">6 Meses de Acesso</span>
                  </div>
                  <span className="text-4xl font-black text-white">50€</span>
                </div>

                <div className="space-y-3">
                  {jaTemAcesso ? (
                    <a
                      href={TELEGRAM_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      <Send className="w-5 h-5" />
                      Entrar no Grupo
                    </a>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={checkoutLoading || checkingAccess}
                      className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                    >
                      {(checkoutLoading || checkingAccess) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
                      Garantir Lugar — 50€ / 6 Meses
                    </button>
                  )}
                  <p className="text-center text-xs text-blue-200/50">Pagamento único, acesso válido por 6 meses</p>
                </div>
              </div>
            </div>

            {/* Direita: Imagem */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl group h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#03091a] via-[#03091a]/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-70"></div>
              <img
                src="/cadete_mundial.jpeg"
                alt="Abaixo de 3 é Para Meninos"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 space-y-4">
                <ul className="space-y-3">
                  {[
                    'Entradas de odds altas selecionadas',
                    'Apostas Pronta-a-usar',
                    'Acesso Imediato ao Grupo VIP'
                  ].map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
                      <Zap className="w-5 h-5 text-emerald-400 shrink-0 fill-emerald-400/20" />
                      <span className="text-white font-medium text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Secção de Benefícios / Grid Estilo Dashboard */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-500" />
          O que vais encontrar no grupo?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cobertura Total</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Análises diárias focadas em entradas de odds altas, todos os dias, extraídas das melhores oportunidades do mercado.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gestão de Banca Específica</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Odds altas exigem uma gestão de unidades diferente. Vais receber o plano financeiro exato para este tipo de entradas.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Alertas em Tempo Real</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              As notificações chegam diretamente no grupo do Telegram. Tens a entrada explicada de forma clara, pronta a copiar e colar.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
