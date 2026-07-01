import {
  Swords,
  Skull,
  Flame,
  Radio,
  Target,
  Zap,
  Send,
  Eye,
  Volume2,
  VolumeX,
  Play,
  Pause
} from 'lucide-react';
import { useRef, useState } from 'react';

const TELEGRAM_LINK = 'https://t.me/+L5nTnwcUH2xkZTQ0';

export default function Submundo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">

      {/* Cabeçalho da Página */}
      <div className="border-b border-red-900/30 pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
          <Swords className="w-10 h-10 text-red-500" />
          Cadete no <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Submundo</span>
        </h1>
        <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
          Entra na trincheira. O grupo mais bruto do Cadete, onde as apostas de alto risco e as jogadas mais agressivas são disparadas sem filtro.
        </p>
      </div>

      {/* Banner Principal (Estilo Guerra) */}
      <div className="bg-gradient-to-r from-red-700 to-orange-700 rounded-3xl p-1 shadow-[0_0_40px_rgba(239,68,68,0.25)]">
        <div className="bg-[#0a0202] rounded-[22px] p-8 md:p-12 relative overflow-hidden">

          {/* Efeitos de fundo (Blurs) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Esquerda: Informação e CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Acesso Gratuito
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Bem-vindo à <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Linha da Frente</span>
                </h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  Aqui não há meio-termo. Lives explosivas, underdogs e as tacadas que os outros grupos não têm coragem de partilhar. Entra por tua conta e risco.
                </p>
              </div>

              <div className="bg-[#160404]/80 border border-red-900/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <Flame className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Entrada Livre</span>
                  </div>
                  <span className="text-4xl font-black text-white">GRÁTIS</span>
                </div>

                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Send className="w-5 h-5" />
                  Entrar no Submundo
                </a>
                <p className="text-center text-xs text-blue-200/50 mt-3">Acesso imediato ao grupo do Telegram</p>
              </div>
            </div>

            {/* Direita: Vídeo do Submundo */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-red-500/30 shadow-2xl group h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0202] via-[#0a0202]/40 to-transparent opacity-90 z-10 pointer-events-none"></div>
              <video
                ref={videoRef}
                src="/submundo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Controlos do Vídeo */}
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-red-600/80 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-red-600/80 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
              <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
                {[
                  'Lives de alto retorno',
                  'Apostas agressivas e underdogs',
                  'Alertas rápidos, sem enrolação'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/50 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <Zap className="w-5 h-5 text-red-400 shrink-0 fill-red-400/20" />
                    <span className="text-white font-medium text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Secção de Benefícios */}
      <div className="space-y-6 pt-4">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-red-500" />
          O que se passa nesta trincheira?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#160404] border border-red-900/40 rounded-2xl p-6 hover:border-red-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Sinais no Terreno</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Entradas disparadas em tempo real. Quando a oportunidade aparece, tu és o primeiro a saber — sem atrasos.
            </p>
          </div>

          <div className="bg-[#160404] border border-red-900/40 rounded-2xl p-6 hover:border-red-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform">
              <Skull className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Só para os Corajosos</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Odds altas, risco alto, adrenalina máxima. Este não é um grupo para quem quer jogar pelo seguro.
            </p>
          </div>

          <div className="bg-[#160404] border border-red-900/40 rounded-2xl p-6 hover:border-red-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Visão de Insider</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              As jogadas que ficam fora dos radares normais. Informação bruta, direta da frente de batalha do Cadete.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
