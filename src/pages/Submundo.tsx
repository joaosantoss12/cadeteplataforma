import { Target, Flame, Banknote, ShieldAlert, TrendingUp, Swords } from 'lucide-react';
import { useRef } from 'react';

// Dados de exemplo para a galeria de lucros
const printsLucro = [
  { id: 1, img: '/green1.jpeg', odd: '@1.72', lucro: '72€', liga: 'Brasileirão' },
  { id: 2, img: '/green2.jpeg', odd: '@2.21', lucro: '121€', liga: 'Brasileirão' },
  { id: 3, img: '/green3.jpeg', odd: '@1.60', lucro: '120€', liga: 'Brasileirão' },
  { id: 4, img: '/green4.jpeg', odd: '@2.10', lucro: '220€', liga: 'Liga Japonesa' },
  { id: 5, img: '/green7.jpg', odd: '@3.15', lucro: '215€', liga: 'Liga 3 Portugal' },
  { id: 6, img: '/green6.jpeg', odd: '@1.81', lucro: '162€', liga: 'Liga Japonesa' },
];

export default function Submundo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    if (videoRef.current) {
      videoRef.current.load(); // Recarrega o vídeo para mostrar o poster
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">
      
      {/* Cabeçalho da Página - Gritty & Agressivo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <Swords className="w-10 h-10 text-blue-500" />
            Cadete no <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Submundo</span>
          </h1>
          <p className="mt-2 text-blue-200/70 max-w-2xl text-lg">
            Onde os 'bookies' erram e nós lucramos. Operações táticas em ligas obscuras, mercados de baixa liquidez e informações privilegiadas.
          </p>
        </div>
        
        {/* Contador de Impacto */}
        <div className="bg-[#0f0320] border border-blue-900/50 p-4 rounded-xl flex items-center gap-4 shrink-0 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-blue-950 flex items-center justify-center border border-blue-500/30">
                <Flame className="w-6 h-6 text-blue-400 animate-pulse" />
            </div>
            <div>
                <p className="text-3xl font-black text-blue-400">+450% ROI</p>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ligas Obscuras (Mês)</p>
            </div>
        </div>
      </div>

      {/* Hero Banner Submundo - Tático / Trincheira */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[420px] border-4 border-zinc-800 bg-[#050c1f]">
        
        {/* --- LADO ESQUERDO: Conteúdo --- */}
        <div className="relative z-20 w-full md:w-[60%] p-8 md:p-12 flex flex-col justify-center">
          
          {/* Badge Alerta Tático */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full mb-6 uppercase tracking-wider backdrop-blur-sm w-fit">
            <ShieldAlert className="w-4 h-4" />
            Operação de Alto Risco / Alto Retorno
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            Guerra ao Mercado.<br /> Lucro na <span className="text-blue-400">Escuridão.</span>
          </h2>
          
          <p className="text-zinc-300 text-lg mb-8 max-w-xl leading-relaxed border-l-4 border-blue-600 pl-4 bg-blue-950/20 py-2 rounded-r-lg">
            Esquece a Champions. Aqui operamos em divisões secundárias de vários países. Onde ninguém olha, nós encontramos ouro.
          </p>
          
          {/* Botão CTA Aumentado */}
          <a 
            href="https://t.me/+OVZZVBOjHLs3YTU0"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg md:text-xl py-6 px-10 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1 w-full sm:w-auto uppercase tracking-wide border-2 border-blue-400/30 whitespace-nowrap flex justify-center items-center gap-3 cursor-pointer"
          >
            <Swords className="w-6 h-6" />
            Infiltrar no Grupo do Submundo
          </a>

        </div>

        {/* --- LADO DIREITO: Imagem --- */}
        <div className="relative z-10 hidden md:block w-full md:w-[40%]">
          {/* Imagem do Submundo */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-luminosity"
            style={{ backgroundImage: "url('/cadete_submundo.jpg')" }}
          ></div>
          
          {/* Gradiente de transição */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#050c1f] via-[#050c1f]/30 to-transparent"></div>
          {/* Gradiente de fundo para suavizar a parte de baixo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050c1f] via-transparent to-transparent"></div>
        </div>

      </div>

      {/* Secção de Vídeo - Pequeno e Centrado */}
      <div className="flex justify-center">
        <div className="w-full max-w-md rounded-xl overflow-hidden border-2 border-zinc-800 shadow-lg bg-zinc-900">
          <video 
            ref={videoRef}
            className="w-full h-auto"
            controls
            poster="/cadete_submundo.jpg"
            onEnded={handleVideoEnd}
          >
            <source src="/submundo.mp4" type="video/mp4" />
            O teu navegador não suporta a reprodução de vídeos.
          </video>
        </div>
      </div>

      {/* Secção: Histórico de Guerra */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
            <Banknote className="w-7 h-7 text-blue-400" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Histórico de Guerra</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {printsLucro.map((print) => (
            <div key={print.id} className="group relative rounded-xl overflow-hidden border-2 border-zinc-800 bg-zinc-900 shadow-lg transition-all hover:border-blue-700/50 hover:z-50">
              <img 
                src={print.img} 
                alt={`Lucro no Submundo ${print.liga}`}
                className="w-full h-48 object-cover opacity-80 transition-all duration-300 cursor-pointer group-hover:h-auto group-hover:object-contain group-hover:opacity-100 group-hover:max-h-[600px] group-hover:shadow-[0_0_60px_rgba(0,0,0,0.9)]" 
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-black/40 flex items-center justify-between group-hover:opacity-0 transition-opacity border-zinc-700/50">
                <div>
                    <p className="text-[11px] font-black text-white uppercase tracking-widest drop-shadow-lg bg-black/60 px-2 py-1 rounded inline-block mb-1">{print.liga}</p>
                    <p className="text-sm text-white font-bold drop-shadow-md mb-1">{print.odd}</p>
                    <p className="text-xl font-black text-blue-400 drop-shadow-lg" style={{ textShadow: '0 0 8px white, 0 0 12px white' }}>+{print.lucro}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-400 drop-shadow-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Secção: As Táticas do Submundo */}
      <div className="bg-[#081533] border border-blue-900/40 rounded-3xl p-8 space-y-6 shadow-inner">
        <div className="flex items-center gap-3">
            <Target className="w-7 h-7 text-blue-400" />
            <h3 className="text-2xl font-bold text-white uppercase tracking-tight">Regras do Pelotão</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-blue-100/80 leading-relaxed">
            <p className="bg-blue-950/40 p-5 rounded-xl border border-blue-900/30">
                <strong className="text-white block mb-1">1. Ligas Desconhecidas:</strong> Focamos em divisões secundárias, ligas femininas e campeonatos de países menos mediáticos. Onde as casas de apostas erram mais.
            </p>
            <p className="bg-blue-950/40 p-5 rounded-xl border border-blue-900/30">
                <strong className="text-white block mb-1">2. Gestão de Banca Inteligente:</strong> Apostas controladas mas com odds elevadas. Um acerto compensa várias tentativas falhadas. Nunca arriscamos tudo numa entrada.
            </p>
            <p className="bg-blue-950/40 p-5 rounded-xl border border-blue-900/30">
                <strong className="text-white block mb-1">3. Agilidade é Crucial:</strong> As odds mudam rapidamente. Quando a análise sai no VIP, tens de agir de imediato. Hesitar é perder dinheiro.
            </p>
        </div>
      </div>

    </div>
  );
}