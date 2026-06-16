import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Map,
  Coins,
  CheckCircle2,
  Compass,
  ArrowRight,
  Swords,
  Crown,
  Zap,
  Star,
  Loader2,
  X,
  Send
} from 'lucide-react';
import { useConfiguracoes } from '../hooks/useAdmin';
import { useStripeCheckout } from '../hooks/useStripeCheckout';
import { supabase } from '../lib/supabase';

const TELEGRAM_LINK = 'https://t.me/+pP0OBzDU65MwYzlk';

export default function Desafios() {
  const { getConfiguracao, loading } = useConfiguracoes();
  const precoDesafios = getConfiguracao('preco_grupo_desafios') || '49.99';
  const { startCheckout, loading: checkoutLoading, error: checkoutError } = useStripeCheckout();

  const [jaTemAcesso, setJaTemAcesso] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Check if user already has desafios access
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
      if (profile?.subscription_status === 'active' && profile?.subscription_plan === 'desafios') {
        setJaTemAcesso(true);
      }
      setCheckingAccess(false);
    };
    checkAccess();
  }, []);

  // Detect ?payment=success in URL → show modal
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('payment') === 'success' && params.get('plan') === 'desafios') {
      setJaTemAcesso(true);
      setShowModal(true);
      // Clean the URL without reloading
      navigate('/desafios', { replace: true });
    }
  }, [location.search, navigate]);

  const handleComprar = () => {
    const amount = parseFloat(precoDesafios);
    startCheckout({ amount, name: 'Serviço Premium' }, 'payment', 'desafios');
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">

      {/* Modal de Sucesso */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-gradient-to-b from-[#0a1b42] to-[#081533] border border-indigo-500/40 rounded-3xl p-8 max-w-md w-full shadow-[0_0_60px_rgba(79,70,229,0.3)] relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-blue-400/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>

            {/* Ícone */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                <CheckCircle2 className="w-10 h-10 text-emerald-400" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white text-center mb-2">Pagamento Confirmado!</h2>
            <p className="text-blue-200/70 text-center text-sm mb-8">
              O teu acesso ao grupo de Desafios está ativo. Clica no botão abaixo para entrar no grupo privado do Telegram.
            </p>

            <a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              Entrar no Grupo Telegram
            </a>

            <p className="text-blue-400/50 text-xs text-center mt-4">Guarda este link — podes aceder sempre através desta página.</p>
          </div>
        </div>
      )}

      {/* Erro de checkout */}
      {checkoutError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm font-medium">
          {checkoutError}
        </div>
      )}

      {/* Cabeçalho da Página - Tema Aventura/Tesouro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
            <Compass className="w-10 h-10 text-blue-500" />
            Desafios do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Cadete</span>
          </h1>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            A verdadeira caça ao tesouro. Pegamos numa 'stake' baixa e alavancamos passo a passo através de apostas analisadas ao detalhe até ao fim do desafio.
          </p>

          {/* Caixa de Estatísticas do Tesouro */}
          <div className="mt-6 bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-500/30 p-5 rounded-2xl flex items-center gap-5 shadow-[0_0_20px_rgba(37,99,235,0.1)] relative overflow-hidden w-full md:w-fit">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Map className="w-24 h-24 text-blue-500" />
            </div>
            <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shrink-0 relative z-10">
              <Coins className="w-7 h-7 text-blue-400" />
            </div>
            <div className="relative z-10">
              <p className="text-sm font-bold text-blue-400/80 uppercase tracking-widest mb-1">Missão Atual</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-white">20€</span>
                <ArrowRight className="w-5 h-5 text-blue-400/50" />
                <span className="text-3xl font-black text-blue-400">80€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coluna lateral: Pagamento */}
        <div className="flex flex-col gap-4 w-full md:w-auto shrink-0">

          {/* Caixa de Pagamento (Acesso Vitalício) */}
          <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border-2 border-indigo-500/50 p-5 rounded-2xl flex flex-col gap-3 shadow-[0_0_20px_rgba(79,70,229,0.15)] relative overflow-hidden md:min-w-[260px]">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Crown className="w-24 h-24 text-indigo-500" />
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <Star className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Acesso Vitalício</span>
            </div>
            <div className="relative z-10">
              {loading ? (
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              ) : (
                <span className="text-3xl font-black text-white">{parseFloat(precoDesafios).toFixed(2)}€</span>
              )}
              <span className="text-blue-300/60 text-sm font-medium ml-1.5">pagamento único</span>
            </div>
            {jaTemAcesso ? (
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Entrar no Grupo
              </a>
            ) : (
              <button
                onClick={handleComprar}
                disabled={checkoutLoading || loading || checkingAccess}
                className="relative z-10 w-full py-3 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {(checkoutLoading || checkingAccess) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                Comprar Acesso
              </button>
            )}
          </div>
        </div>
      </div>

      {/* O MAPA DO TESOURO (Stepper Visual) */}
      <div className="bg-[#081533]/80 border border-blue-900/40 rounded-3xl p-6 md:p-10 shadow-xl relative overflow-hidden">
        {/* Efeito visual de fundo de mapa pergaminho sutil */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent"></div>

        <h3 className="text-2xl font-bold text-white mb-12 flex items-center gap-3 relative z-10">
          <Map className="w-6 h-6 text-blue-500" />
          Rota do Desafio 80€
        </h3>

        {/* Container do Caminho */}
        <div className="relative z-10 max-w-5xl mx-auto">

          {/* LINHA TRACEJADA - Fundo (Adapta-se a Mobile/Desktop) */}
          <div className="absolute left-[27px] top-0 bottom-0 w-1 border-l-2 border-dashed border-blue-800/60 md:hidden z-0"></div>
          <div className="hidden md:block absolute top-[27px] left-0 right-0 h-1 border-t-2 border-dashed border-blue-800/60 z-0"></div>

          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 relative z-10">

            {/* Passo 1 - Concluído */}
            <div className="flex md:flex-col items-start md:items-center relative group w-full md:w-1/3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg border-4 transition-all duration-300 bg-emerald-500/20 border-emerald-500 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="ml-6 md:ml-0 md:mt-6 w-full opacity-100 text-left md:text-center">
                <div className="inline-block px-3 py-1 bg-[#0a1b42] border border-blue-900/40 rounded-lg mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">Passo 1</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Valor: 20€</h4>
                <p className="text-sm text-blue-300/70 mb-2">Vitória do Arsenal <span className="font-bold text-blue-200">(@1.80)</span></p>
                <p className="text-emerald-400 font-bold text-sm">Retorno: 36€ ✓</p>
              </div>
            </div>

            {/* Passo 2 - Concluído */}
            <div className="flex md:flex-col items-start md:items-center relative group w-full md:w-1/3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg border-4 transition-all duration-300 bg-emerald-500/20 border-emerald-500 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="ml-6 md:ml-0 md:mt-6 w-full opacity-100 text-left md:text-center">
                <div className="inline-block px-3 py-1 bg-[#0a1b42] border border-blue-900/40 rounded-lg mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">Passo 2</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Valor: 36€</h4>
                <p className="text-sm text-blue-300/70 mb-2">Over 2.5 Golos (City) <span className="font-bold text-blue-200">(@1.55)</span></p>
                <p className="text-emerald-400 font-bold text-sm">Retorno: 56€ ✓</p>
              </div>
            </div>

            {/* Passo 3 - Atual (Tesouro Final) */}
            <div className="flex md:flex-col items-start md:items-center relative group w-full md:w-1/3">
              <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0 z-10 shadow-lg border-4 transition-all duration-300 bg-blue-500 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110">
                <Swords className="w-6 h-6 animate-pulse" />
              </div>
              <div className="ml-6 md:ml-0 md:mt-6 w-full opacity-100 text-left md:text-center">
                <div className="inline-block px-3 py-1 bg-[#0a1b42] border border-blue-900/40 rounded-lg mb-2">
                  <span className="text-xs font-black uppercase tracking-widest text-blue-400">Passo 3</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Valor: 56€</h4>
                <p className="text-sm text-blue-300/70 mb-2">Ambas Marcam (Real Madrid) <span className="font-bold text-blue-200">(@1.45)</span></p>
                <p className="text-blue-400 font-bold text-sm">Alvo: 80€</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Cartão de Ação - Passo Atual */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-[0_0_30px_rgba(37,99,235,0.2)] transform hover:-translate-y-1 transition-transform">
        <div className="bg-[#03091a] rounded-[22px] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 h-full relative overflow-hidden">

          {/* Fundo decorativo brilhante */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>

          <div className="flex-1 relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Aposta Pronta a Copiar
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Entrada do Passo 3</h3>
            <p className="text-blue-200/80">O barco já partiu e estamos a meio da viagem. Copia a entrada de 56€ agora mesmo e vamos em busca do tesouro final.</p>
          </div>

          <div className="w-full md:w-auto shrink-0 relative z-10 flex flex-col gap-3">
            <a
              href="https://t.me/cadetesuport?text=Cadete%20quero%20fazer%20parte%20do%20desafio%20%F0%9F%92%AA%F0%9F%8F%BC%F0%9F%9A%80"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 text-white font-black text-sm py-3 px-6 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
            >
              <Coins className="w-5 h-5" />
              Contactar Telegram
            </a>
            {jaTemAcesso ? (
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-[#081533] border border-indigo-500/40 hover:border-indigo-500/70 text-white font-black text-sm py-3 px-6 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-5 h-5" />
                Entrar no Grupo
              </a>
            ) : (
              <button
                onClick={handleComprar}
                disabled={checkoutLoading || loading || checkingAccess}
                className="w-full md:w-auto bg-[#081533] border border-indigo-500/40 hover:border-indigo-500/70 text-white font-black text-sm py-3 px-6 rounded-xl transition-all uppercase tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {(checkoutLoading || checkingAccess) ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
                Comprar Acesso
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --- TÍTULO ACESSO DIRETO (mesmo nível que o cabeçalho da página) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
            <Crown className="w-10 h-10 text-blue-500" />
            Acesso direto ao grupo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Desafios</span>
          </h2>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            Escolhe o plano que melhor se adapta à tua banca. Todos os planos dão acesso integral a todas as ferramentas, análises e ao grupo exclusivo.
          </p>
        </div>
      </div>

      {/* --- CARTÃO DE PREÇO ÚNICO --- */}
      <div className="flex justify-center pt-6">

        {/* PLANO ÚNICO */}
        <div className="bg-gradient-to-b from-[#0a1b42] to-[#081533] border-2 border-indigo-500/50 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(79,70,229,0.15)] flex flex-col relative w-full max-w-md">

          {/* Badge de Destaque */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Star className="w-3.5 h-3.5 fill-white" />
            Acesso Vitalício
          </div>

          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 mb-2">Plano Desafios</h3>
            <p className="text-blue-200/60 text-sm">Pagamento único. Acesso completo e vitalício ao grupo de desafios e todas as ferramentas.</p>
          </div>
          <div className="mb-8 text-center">
            {loading ? (
              <Loader2 className="w-10 h-10 animate-spin text-white mx-auto" />
            ) : (
              <span className="text-6xl font-black text-white">{parseFloat(precoDesafios).toFixed(2)}€</span>
            )}
            <p className="text-emerald-400 font-bold text-sm mt-2">Pagamento Único</p>
          </div>

          <ul className="space-y-4 mb-8">
            {[
              'Acesso ao Grupo de Desafios',
              'Suporte Prioritário',
              'Desafios de Alavancagem',
              'Gestão de Banca Exclusiva',
              'Mentoria 1on1 (em breve)'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 fill-indigo-400/20" />
                <span className="text-white text-sm font-medium">{feature}</span>
              </li>
            ))}
          </ul>

          {jaTemAcesso ? (
            <>
              <button
                disabled
                className="w-full py-4 rounded-xl font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center gap-2 cursor-not-allowed mb-3"
              >
                <CheckCircle2 className="w-5 h-5" />
                Acesso Ativo
              </button>
              <a
                href={TELEGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600/60 to-indigo-600/60 hover:from-blue-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" />
                Entrar no Grupo Telegram
              </a>
            </>
          ) : (
            <button
              onClick={handleComprar}
              disabled={checkoutLoading || loading || checkingAccess}
              className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {(checkoutLoading || checkingAccess) ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              Comprar Acesso
            </button>
          )}
        </div>

      </div>

    </div>
  );
}