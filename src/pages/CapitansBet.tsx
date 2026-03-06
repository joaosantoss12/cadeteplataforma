import { useEffect, useRef, useState } from 'react';
import { 
  Sparkles, 
  Trophy,
  Crown,
  Zap,
  TrendingUp
} from 'lucide-react';

// Gera valores aleatórios com diferentes faixas
const generateWinnings = () => {
  const random = Math.random();
  let min, max;
  
  if (random < 0.8) {
    // 80% chance - Centenas (150-950)
    min = 150;
    max = 950;
  } else if (random < 0.95) {
    // 15% chance - Milhares (1000-9999)
    min = 1000;
    max = 9999;
  } else {
    // 5% chance - Acima de 10 mil (10000-50000)
    min = 10000;
    max = 50000;
  }
  
  return (Math.random() * (max - min) + min).toFixed(2);
};

// Gera inicial aleatória
const generateInitial = () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters[Math.floor(Math.random() * letters.length)];
};

// Nomes de slots populares e suas imagens
const slotData = [
  { 
    name: 'Sweet Bonanza', 
    image: '/1.jpg'
  },
  { 
    name: 'Gates of Olympus', 
    image: '/5.jpg'
  },
  { 
    name: 'Sugar Rush', 
    image: '/8.jpg'
  },
  { 
    name: 'Big Bass Bonanza', 
    image: '/12.jpg'
  },
  { 
    name: 'Starlight Princess', 
    image: '/15.jpg'
  },
  { 
    name: 'The Dog House', 
    image: '/18.jpg'
  },
  { 
    name: 'Wolf Gold', 
    image: '/20.jpg'
  },
  { 
    name: 'Lucky Tiger Gold', 
    image: '/22.jpg'
  },
  { 
    name: 'Fire Joker', 
    image: '/25.png'
  },
  { 
    name: 'Wild Wild Riches', 
    image: '/28.png'
  },
  { 
    name: 'Buffalo King', 
    image: '/30.png'
  },
  { 
    name: 'Fruit Party', 
    image: '/31.png'
  }
];

// Gera array de vencedores com dados aleatórios
const winners = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  initial: generateInitial(),
  amount: generateWinnings(),
  slot: slotData[i % slotData.length].name,
  image: slotData[i % slotData.length].image
}));

export default function CapitansBet() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const pausedRef = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const SCROLL_SPEED = 80; // pixels per second, adjust to taste

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // initialize
    track.style.transform = 'translateX(0px)';
    offsetRef.current = 0;
    lastTimeRef.current = performance.now();

    function step(time: number) {
      if (!track) return;
      if (pausedRef.current) {
        lastTimeRef.current = time;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      const last = lastTimeRef.current || time;
      const dt = Math.max(0, (time - last) / 1000);
      lastTimeRef.current = time;

      const singleWidth = track.scrollWidth / 2; // one set width (we duplicate the items)
      offsetRef.current += SCROLL_SPEED * dt;
      if (offsetRef.current >= singleWidth) {
        offsetRef.current -= singleWidth;
      }

      track.style.transform = `translateX(-${offsetRef.current}px)`;
      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-3xl p-1 shadow-[0_0_40px_rgba(37,99,235,0.4)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-16 relative overflow-hidden">
          
          {/* Efeitos de fundo */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8">
            
            {/* Logo/Título */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-blue-400 animate-pulse" />
              <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 drop-shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                CapitansBet
              </h1>
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-blue-400 animate-pulse" />
            </div>

            {/* Subtítulo */}
            <p className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
              O Casino parceiro do <span className="text-blue-400">Cadete</span>
            </p>

            {/* CTA Principal */}
            <div className="pt-8 space-y-4">
              <a 
                href="https://captainspartners.com/processing/click?btag=17471_20645"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xl md:text-2xl py-6 px-16 rounded-2xl shadow-[0_0_60px_rgba(37,99,235,0.7)] hover:shadow-[0_0_80px_rgba(37,99,235,0.9)] transition-all transform hover:scale-105 uppercase tracking-wide cursor-pointer"
              >
                <Sparkles className="w-7 h-7" />
                Entrar Agora
              </a>
              <p className="text-blue-300/80 text-sm font-medium">🎁 Recebe 200% no primeiro depósito até 500€</p>
            </div>

          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="space-y-6">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-8">
          Porquê escolher a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">CapitansBet</span>?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Levantamentos Rápidos</h3>
                <p className="text-blue-200/70">Recebe os teus ganhos em minutos. Sem burocracias, sem esperas.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Slots Exclusivos</h3>
                <p className="text-blue-200/70">Acesso aos melhores jogos dos fornecedores mais conceituados.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Crown className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Programa VIP</h3>
                <p className="text-blue-200/70">Cashback, bónus personalizados e gestor de conta dedicado.</p>
              </div>
            </div>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">RTP Elevado</h3>
                <p className="text-blue-200/70">Jogos certificados com Return to Player acima da média do mercado.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Rodapé com Vencedores Recentes - Scroll Horizontal Automático (JS-driven para fluxo contínuo) */}
      <div className="mt-12 pt-8 border-t border-blue-900/30">
        <h3 className="text-xl font-bold text-white text-center mb-6 flex items-center justify-center gap-2">
          <span className="text-2xl">🎰</span>
          Vencedores Recentes
        </h3>

        <div className="relative overflow-hidden">
          {/* Gradientes nas bordas */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#03091a] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#03091a] to-transparent z-10 pointer-events-none"></div>

          <div className="w-full overflow-hidden">
            <div
              ref={trackRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex gap-4 will-change-transform"
            >
              {/* Duplica os vencedores para efeito de scroll infinito */}
              {[...winners, ...winners].map((winner, index) => (
                <div 
                  key={index}
                  className="group flex-shrink-0 w-64 bg-[#081533] border border-blue-900/40 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all relative cursor-pointer"
                >
                  {/* Imagem da Slot */}
                  <div className="relative h-32 overflow-hidden">
                    <img 
                      src={winner.image} 
                      alt={winner.slot}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/339x180/081533/3B82F6?text=Slot+Game';
                      }}
                    />
                    {/* Overlay gradiente */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#081533] via-[#081533]/60 to-transparent"></div>
                  </div>
                  
                  <div className="relative z-10 p-3 text-center space-y-2">
                    {/* Inicial e Nome */}
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-black text-blue-400">
                        {winner.initial}
                        <span className="text-blue-900/50 text-sm">******</span>
                      </div>
                      <p className="text-xs text-blue-300/60 font-medium">{winner.slot}</p>
                    </div>
                    
                    {/* Valor Ganho */}
                    <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-lg py-2 px-3">
                      <p className="text-xs text-blue-400/80 uppercase tracking-wider mb-1">Ganhou</p>
                      <p className="text-lg font-black text-blue-400">€{winner.amount}</p>
                    </div>

                    {/* Botão Jogar - Aparece ao hover */}
                    <div className="absolute inset-0 flex items-center justify-center bg-[#081533]/95 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl">
                      <a 
                        href="https://t.me/cadetesuport"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-sm py-2 px-6 rounded-lg shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all transform hover:scale-105 uppercase tracking-wide"
                      >
                        Jogar
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
