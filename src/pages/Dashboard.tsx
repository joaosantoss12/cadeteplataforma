import { TrendingUp, CheckCircle, Zap, Users, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Hero Banner VIP - Dividido em 2 Lados */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[480px] border border-blue-900/40 bg-[#03091a] group">
        
        {/* Fundo Global (Estádio escurecido a abranger tudo) */}
        <div 
          className="absolute inset-0 bg-cover bg-center z-0 scale-105"
          style={{ backgroundImage: "url('/image_251363.jpg')" }}
        ></div>
        <div className="absolute inset-0 bg-[#03091a]/85 z-0"></div>
        
        {/* --- LADO ESQUERDO: Texto e Botões --- */}
        <div className="relative z-20 w-full md:w-[60%] p-8 md:p-12 flex flex-col justify-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full mb-6 uppercase tracking-wider backdrop-blur-md w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            Vagas Abertas
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Copia. Cola. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Lucra.</span>
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div>
              <p className="text-4xl md:text-5xl font-black text-white">84.5%</p>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Acerto</p>
            </div>
            <div className="w-px h-10 bg-blue-800/50 hidden sm:block"></div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-white">+12K€</p>
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Lucro Comunidade</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5 text-slate-300 font-medium text-sm sm:text-base">
            <Users className="w-5 h-5 text-indigo-400 shrink-0" />
            <p>
              Mais de 12000 membros faturam. <span className="text-red-400 font-bold ml-1">Vagas a fechar!</span>
            </p>
          </div>
          
          <a 
            href="https://t.me/+h5HDhTdXCYo4MzI5"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-[13px] sm:text-base md:text-lg lg:text-xl py-5 px-4 md:py-7 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:shadow-[0_0_60px_rgba(37,99,235,0.8)] transition-all transform hover:-translate-y-1 w-full uppercase tracking-wide border border-blue-400/30 whitespace-nowrap flex justify-center items-center relative overflow-hidden group/btn cursor-pointer"
          >
            <span className="relative z-10">Entrar Agora e Receber Entradas</span>
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover/btn:scale-100 group-hover/btn:bg-white/10"></div>
          </a>

          <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-amber-400 bg-amber-500/10 px-4 py-2 rounded-lg border border-amber-500/20 backdrop-blur-md w-fit">
            <AlertCircle className="w-4 h-4 animate-pulse" />
            🔥 Próximo jogo em menos de 2h
          </div>

        </div>

        {/* --- LADO DIREITO: Imagem do Cadete --- */}
        {/* Escondida em telemóvel (para não esmagar o layout) e visível a partir de tablet/computador */}
        <div className="relative z-10 hidden md:block w-full md:w-[40%]">
          {/* Imagem do Cadete com opacidade reduzida e modo blend para absorver o azul */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity"
            style={{ backgroundImage: "url('/cadete_main.jpeg')" }}
          ></div>
          
          {/* Gradiente de transição (Esfuma a borda esquerda da imagem para não parecer cortada a pique) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#03091a] via-[#03091a]/30 to-transparent"></div>
          {/* Gradiente de fundo para suavizar a parte de baixo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#03091a] via-transparent to-transparent"></div>
        </div>

      </div>

      {/* Secção de Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#081533] p-6 rounded-2xl border border-blue-900/40 shadow-lg flex items-center gap-5 hover:border-blue-700/50 transition-colors duration-300 hover:-translate-y-1 transform">
          <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0 border border-emerald-500/20">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-300/60 uppercase tracking-widest">Este Mês</p>
            <h3 className="text-2xl font-black text-blue-50">84.5% Green</h3>
          </div>
        </div>

        <div className="bg-[#081533] p-6 rounded-2xl border border-blue-900/40 shadow-lg flex items-center gap-5 hover:border-blue-700/50 transition-colors duration-300 hover:-translate-y-1 transform">
          <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 border border-blue-500/20">
            <TrendingUp className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-300/60 uppercase tracking-widest">Odd Média</p>
            <h3 className="text-2xl font-black text-blue-50">@1.85</h3>
          </div>
        </div>

        <div className="bg-[#081533] p-6 rounded-2xl border border-blue-900/40 shadow-lg flex items-center gap-5 hover:border-blue-700/50 transition-colors duration-300 hover:-translate-y-1 transform">
          <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 border border-indigo-500/20">
            <Zap className="w-7 h-7" />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-300/60 uppercase tracking-widest">Análises VIP</p>
            <h3 className="text-2xl font-black text-blue-50">+120 Partilhadas</h3>
          </div>
        </div>
      </div>

    </div>
  );
}
