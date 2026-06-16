import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Crown,
  Lock,
  Sparkles,
  CheckCircle2,
  Loader2,
  AlertCircle,
  X,
  FileText,
  TrendingUp,
  Target,
  Calendar,
} from 'lucide-react';
import { useConfiguracoes } from '../hooks/useAdmin';
import { useStripeCheckout } from '../hooks/useStripeCheckout';
import { supabase } from '../lib/supabase';
import type { AnalisePremium as AnalisePremiumType } from '../types/database';
import { formatData } from '../utils/format';

// Devolve a data (YYYY-MM-DD) de um momento no fuso horário de Portugal.
function toLisbonDateString(d: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Lisbon' }).format(d);
}

// Verifica se a hora atual em Portugal é anterior ao limite de compra "HH:MM".
function isPurchaseWindowOpen(horaLimite: string): boolean {
  const match = horaLimite.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return true; // sem limite válido → permitir compra
  const limitMinutes = parseInt(match[1], 10) * 60 + parseInt(match[2], 10);

  const nowParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
  const [h, m] = nowParts.split(':').map(Number);
  const nowMinutes = h * 60 + m;

  return nowMinutes < limitMinutes;
}

export default function AnalisePremium() {
  const { getConfiguracao, loading: configLoading } = useConfiguracoes();
  const precoAnalise = parseFloat(getConfiguracao('preco_analise_premium') || '5.00');
  const ativa = getConfiguracao('analise_premium_ativa') !== 'false';
  // Hora limite (Portugal) até à qual é possível comprar a análise premium.
  const horaLimite = getConfiguracao('horas_reset_analise_premium') || '23:59';
  const compraAberta = isPurchaseWindowOpen(horaLimite);

  const { startCheckout, loading: checkoutLoading, error: checkoutError } = useStripeCheckout();

  const [analise, setAnalise] = useState<AnalisePremiumType | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const checkAll = async () => {
    setLoadingData(true);

    const { data: analiseRaw } = await supabase
      .from('analise_premium')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const analiseData = analiseRaw as AnalisePremiumType | null;
    setAnalise(analiseData);

    if (analiseData) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: compraRaw } = await supabase
          .from('compras_premium')
          .select('data_compra')
          .eq('user_id', user.id)
          .eq('analise_premium_id', analiseData.id)
          .maybeSingle();

        const compra = compraRaw as { data_compra: string } | null;
        if (compra) {
          // Só dá acesso se a compra foi feita no mesmo dia (dia/mês/ano) da aposta premium.
          const diaCompra = toLisbonDateString(new Date(compra.data_compra));
          const diaAposta = (analiseData.data || '').slice(0, 10);
          if (diaCompra === diaAposta) setHasAccess(true);
        }
      }
    }

    setLoadingData(false);
  };

  useEffect(() => {
    if (!configLoading) checkAll();
  }, [configLoading]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success' && params.get('plan') === 'analise_premium') {
      setShowModal(true);
      navigate('/analise-premium', { replace: true });
      // Re-check access after a short delay to allow the webhook to process
      setTimeout(() => checkAll(), 3000);
    }
  }, [location.search]);

  const handleComprar = () => {
    if (!analise || !compraAberta) return;
    startCheckout(
      { amount: precoAnalise, name: 'Serviço Premium' },
      'payment',
      'analise_premium',
      analise.id,
    );
  };

  const isLoading = configLoading || loadingData;

  // ─── LOADING ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // ─── INACTIVE — no analysis available ─────────────────────────────
  if (!ativa || !analise) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-16">
        <PageHeader analise={null} />
        <div className="bg-[#03091a] rounded-3xl border border-blue-900/40 p-12 min-h-[400px] flex items-center justify-center">
          <div className="text-center max-w-md space-y-4">
            <div className="w-20 h-20 rounded-full bg-blue-900/30 border border-blue-800/40 flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-blue-600/60" />
            </div>
            <h2 className="text-2xl font-black text-white">Sem análise disponível</h2>
            <p className="text-blue-200/60">
              Neste momento não há nenhuma análise premium ativa. Volta em breve para a próxima análise exclusiva.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── UNLOCKED — user has active access ────────────────────────────
  if (hasAccess) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-16">
        {showModal && <SuccessModal onClose={() => setShowModal(false)} />}
        <PageHeader analise={analise} />

        {/* Acesso ativo */}
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-3 text-emerald-400 text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Acesso ativo — esta análise está desbloqueada para ti.</span>
        </div>

        {/* Card Principal */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
          <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden">

            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 space-y-8">

              {/* Cabeçalho Jogo */}
              <div className="text-center border-b border-blue-900/30 pb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                  {analise.liga}
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-3">{analise.jogo}</h2>
                <p className="text-blue-200/60 text-lg">
                  {formatData(analise.data)} às {analise.hora}
                </p>
              </div>

              {/* Aposta e Odd */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Aposta</h3>
                  </div>
                  <p className="text-3xl font-black text-white">{analise.aposta}</p>
                </div>

                <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                    </div>
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Odd</h3>
                  </div>
                  <p className="text-3xl font-black text-white">@{Number(analise.odd).toFixed(2)}</p>
                </div>
              </div>

              {/* Análise Detalhada */}
              <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-500" />
                  Análise Detalhada
                </h3>
                <div className="space-y-4 text-blue-100/90 leading-relaxed">
                  <p><strong className="text-white">Contexto:</strong> {analise.analise_contexto}</p>
                  <p><strong className="text-white">Estatísticas Casa:</strong> {analise.analise_estatisticas_casa}</p>
                  <p><strong className="text-white">Estatísticas Fora:</strong> {analise.analise_estatisticas_fora}</p>
                  <p><strong className="text-white">Conclusão:</strong> {analise.analise_conclusao}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex justify-center pt-4">
                <a
                  href="https://t.me/+h5HDhTdXCYo4MzI5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base md:text-lg py-5 px-10 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-1 uppercase tracking-wide border border-blue-400/30 cursor-pointer"
                >
                  Discutir no Grupo Grátis
                </a>
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── LOCKED — analysis exists but not purchased ────────────────────
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      {showModal && <SuccessModal onClose={() => setShowModal(false)} />}

      {checkoutError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm font-medium">
          {checkoutError}
        </div>
      )}

      <PageHeader analise={null} />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden min-h-[600px] flex items-center justify-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8">
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] border-4 border-blue-400/20">
                <Lock className="w-12 h-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Conteúdo Premium Bloqueado</h2>
              <p className="text-blue-200/70 text-lg">
                Acede à análise mais profunda e rentável do Cadete. Pagamento único com acesso permanente.
              </p>
              <p className={`mt-3 text-sm font-bold ${compraAberta ? 'text-blue-300/80' : 'text-red-400'}`}>
                {compraAberta
                  ? `Disponível para compra até às ${horaLimite} (hora de Portugal).`
                  : `Compras encerradas — o limite era às ${horaLimite} (hora de Portugal).`}
              </p>
            </div>

            <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-bold text-white mb-6 text-center">O que está incluído:</h3>
              <ul className="space-y-4">
                {[
                  'Análise completa de um jogo premium com odd mínima de @1.60',
                  'Estatísticas avançadas e modelos preditivos exclusivos',
                  'Histórico de acertos superior a 75% nos últimos 6 meses',
                  'Acesso permanente à análise após a compra',
                  'Estratégia de aposta e gestão de banca incluída',
                  'Suporte via Telegram para esclarecimento de dúvidas',
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-blue-100/90 text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0a1b42] to-[#081533] border border-blue-500/30 rounded-2xl p-6 inline-block">
                <p className="text-sm text-blue-400/80 uppercase tracking-widest mb-2">Pagamento Único</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white">{precoAnalise.toFixed(2)}€</span>
                  <span className="text-blue-400/60 font-medium text-xl">/análise</span>
                </div>
              </div>
              <div>
                <button
                  onClick={handleComprar}
                  disabled={checkoutLoading || !compraAberta}
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg py-6 px-12 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-1 uppercase tracking-wide border border-blue-400/30 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {checkoutLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Crown className="w-6 h-6" />}
                  {compraAberta ? 'Comprar Análise Premium' : 'Compras Encerradas'}
                </button>
                <p className="text-blue-300/60 text-sm mt-4">
                  {compraAberta ? 'Pagamento único. Sem subscrições.' : 'Volta amanhã para a próxima análise.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function PageHeader({ analise }: { analise?: AnalisePremiumType | null }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
          <Crown className="w-10 h-10 text-blue-500" />
          Análises <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Premium</span>
        </h1>
        <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
          As melhores análises VIP do Cadete. Jogos estudados ao mais ínfimo detalhe com taxa de acerto superior a 75%.
        </p>
      </div>
      {analise ? (
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-500/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400/80 uppercase tracking-widest">Data</p>
            <p className="text-lg font-black text-white">{formatData(analise.data)}</p>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Conteúdo</p>
            <p className="text-lg font-black text-white">Exclusivo</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gradient-to-b from-[#0a1b42] to-[#081533] border border-indigo-500/40 rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(79,70,229,0.3)] relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-blue-400/60 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.2)]">
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white text-center mb-2">Pagamento Confirmado!</h2>
        <p className="text-blue-200/70 text-center text-sm mb-6">
          O teu acesso à análise premium está ativo. A análise ficará disponível em instantes.
        </p>
        <button
          onClick={onClose}
          className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2"
        >
          <Crown className="w-5 h-5" />
          Ver Análise
        </button>
      </div>
    </div>
  );
}
