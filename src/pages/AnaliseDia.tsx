import { 
  FileText, 
  TrendingUp, 
  Target,
  Calendar,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAnaliseDia } from '../hooks/useAnalises';

export default function AnaliseDia() {
  const { analise, loading } = useAnaliseDia();
  
  const hoje = new Date().toLocaleDateString('pt-PT', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-3" />
          <p className="text-blue-200/60">A carregar análise do dia...</p>
        </div>
      </div>
    );
  }

  if (!analise) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500 pb-16">
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
              <FileText className="w-10 h-10 text-blue-500" />
              Análise do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Dia</span>
            </h1>
            <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
              A aposta do dia analisada ao detalhe.
            </p>
          </div>
        </div>

        {/* Mensagem sem análise */}
        <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-12 text-center">
          <AlertCircle className="w-16 h-16 text-blue-400/50 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Sem análise para hoje</h2>
          <p className="text-blue-200/60 max-w-md mx-auto">
            Ainda não foi publicada a análise do dia. Volta mais tarde ou junta-te ao grupo para seres notificado.
          </p>
          <a 
            href="https://t.me/+h5HDhTdXCYo4MzI5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-8 rounded-xl transition-all"
          >
            Juntar ao Grupo
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
            <FileText className="w-10 h-10 text-blue-500" />
            Análise do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Dia</span>
          </h1>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            A aposta do dia analisada ao detalhe. Um único jogo, estudado profundamente para maximizar as probabilidades.
          </p>
        </div>
        
        {/* Badge Data */}
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-500/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_20px_rgba(37,99,235,0.1)]">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/30 shrink-0">
            <Calendar className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-400/80 uppercase tracking-widest">Hoje</p>
            <p className="text-lg font-black text-white">{hoje}</p>
          </div>
        </div>
      </div>

      {/* Card Principal de Análise */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-[0_0_30px_rgba(37,99,235,0.2)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden">
          
          {/* Fundo decorativo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          {/* Info do Jogo */}
          <div className="relative z-10 space-y-8">
            
            {/* Cabeçalho Jogo */}
            <div className="text-center border-b border-blue-900/30 pb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                {analise.liga}
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
                {analise.jogo}
              </h2>
              <p className="text-blue-200/60 text-lg">Hoje às {analise.hora}</p>
            </div>

            {/* Aposta e Odd */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Aposta */}
              <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Aposta</h3>
                </div>
                <p className="text-3xl font-black text-white">{analise.aposta}</p>
              </div>

              {/* Odd */}
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
                <p>
                  <strong className="text-white">Contexto:</strong> {analise.analise_contexto}
                </p>
                
                <p>
                  <strong className="text-white">Estatísticas Casa:</strong> {analise.analise_estatisticas_casa}
                </p>
                
                <p>
                  <strong className="text-white">Estatísticas Fora:</strong> {analise.analise_estatisticas_fora}
                </p>
                
                <p>
                  <strong className="text-white">Conclusão:</strong> {analise.analise_conclusao}
                </p>
              </div>
            </div>

            {/* Botão CTA */}
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
