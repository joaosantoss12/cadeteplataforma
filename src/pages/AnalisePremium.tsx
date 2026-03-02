import { 
  Crown, 
  Lock,
  Sparkles,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { useConfiguracoes } from '../hooks/useAdmin';

export default function AnalisePremium() {
  const { getConfiguracao, loading } = useConfiguracoes();
  const precoAnalise = getConfiguracao('preco_analise_premium') || '5.00';

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
            <Crown className="w-10 h-10 text-blue-500" />
            Análises <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Premium</span>
          </h1>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            As melhores análises VIP do Cadete. Jogos estudados ao mais ínfimo detalhe com taxa de acerto superior a 75%. Apenas {loading ? '...' : `${parseFloat(precoAnalise).toFixed(2)}€`} por análise.
          </p>
        </div>
        
        {/* Badge Premium */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 border border-blue-400/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Conteúdo</p>
            <p className="text-lg font-black text-white">Exclusivo</p>
          </div>
        </div>
      </div>

      {/* Card Premium Locked */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden min-h-[600px] flex items-center justify-center">
          
          {/* Fundo decorativo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Conteúdo Bloqueado */}
          <div className="relative z-10 text-center max-w-2xl mx-auto space-y-8">
            
            {/* Ícone Lock */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] border-4 border-blue-400/20">
                <Lock className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Título */}
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Conteúdo Premium Bloqueado
              </h2>
              <p className="text-blue-200/70 text-lg">
                Acede às análises mais profundas e rentáveis do Cadete. Subscreve já e desbloqueia o acesso completo.
              </p>
            </div>

            {/* Benefícios */}
            <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-8 text-left">
              <h3 className="text-xl font-bold text-white mb-6 text-center">O que está incluído:</h3>
              <ul className="space-y-4">
                {[
                  'Análise completa de um jogo premium com odd mínima de @1.60',
                  'Estatísticas avançadas e modelos preditivos exclusivos',
                  'Histórico de acertos superior a 75% nos últimos 6 meses',
                  'Acesso à análise por 24 horas após a compra',
                  'Estratégia de aposta e gestão de banca incluída',
                  'Suporte via Telegram para esclarecimento de dúvidas'
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                    <span className="text-blue-100/90 text-base">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Preço e CTA */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0a1b42] to-[#081533] border border-blue-500/30 rounded-2xl p-6 inline-block">
                <p className="text-sm text-blue-400/80 uppercase tracking-widest mb-2">Pagamento Único</p>
                <div className="flex items-baseline gap-2">
                  {loading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  ) : (
                    <span className="text-5xl font-black text-white">{parseFloat(precoAnalise).toFixed(2)}€</span>
                  )}
                  <span className="text-blue-400/60 font-medium text-xl">/análise</span>
                </div>
              </div>

              {/* Botão de Compra */}
              <div>
                <a 
                  href="https://t.me/cadetesuport"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg py-6 px-12 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-1 uppercase tracking-wide border border-blue-400/30 cursor-pointer"
                >
                  <Crown className="w-6 h-6" />
                  Comprar Análise Premium
                </a>
                <p className="text-blue-300/60 text-sm mt-4">Pagamento único. Sem subscrições.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
