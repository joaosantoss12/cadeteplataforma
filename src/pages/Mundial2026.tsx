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
import { useEffect } from 'react';
import { useStripeCheckout } from '../hooks/useStripeCheckout';

const TELEGRAM_LINK = 'https://t.me/+Eu4vvdGhN_gzZTc0';

export default function Mundial2026() {
  const { startCheckout, loading: checkoutLoading, error: checkoutError } = useStripeCheckout();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success' && params.get('plan') === 'mundial_2026') {
      window.location.href = TELEGRAM_LINK;
    }
  }, []);

  const handleSubscribe = () => {
    startCheckout({ amount: 40, name: 'Acesso Mundial 2026' }, 'payment', 'mundial_2026');
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
            Mundial <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">2026</span>
          </h1>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            Garante já o teu lugar no grupo VIP do Mundial 2026. Análises diárias, apostas de valor e acompanhamento total durante a maior competição do mundo.
          </p>
        </div>

        {/* Badge Lateral Informativa */}
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-emerald-500/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Globe className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-400/80 uppercase tracking-widest">Mundial</p>
            <p className="text-lg font-black text-white">EUA, CAN, MEX</p>
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
                  O Maior Palco do <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Futebol</span>
                </h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  Não percas a oportunidade de lucrar com o maior evento desportivo do planeta. Preço especial de pré-lançamento com acesso vitalício ao grupo do mundial.
                </p>
              </div>

              <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Pagamento Único</span>
                  </div>
                  <span className="text-4xl font-black text-white">40€</span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleSubscribe}
                    disabled={checkoutLoading}
                    className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                  >
                    {checkoutLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trophy className="w-5 h-5" />}
                    Garantir Lugar — 40€
                  </button>
                  <p className="text-center text-xs text-blue-200/50">Pagamentos apenas até 1 de Agosto</p>

                  <a
                    href={TELEGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl font-bold text-emerald-400 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                  >
                    <Send className="w-4 h-4" />
                    Entrar Gratuitamente
                  </a>
                </div>
              </div>
            </div>

            {/* Direita: Imagem do Mundial */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-2xl group h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#03091a] via-[#03091a]/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-70"></div>
              <img
                src="/cadete_mundial.jpeg"
                alt="Mundial 2026"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 space-y-4">
                <ul className="space-y-3">
                  {[
                    'Análises diárias de todos os jogos',
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
          O que vais encontrar no passe Mundial?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Cobertura Total</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Desde a fase de grupos até à grande final. Vamos analisar todos os confrontos para extrair as odds de maior valor do mercado.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-emerald-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Gestão de Banca Específica</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Um Mundial exige uma gestão de unidades diferente de uma liga regular. Vais receber o plano financeiro exato para a competição.
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