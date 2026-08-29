import {
  Swords,
  Star,
  Flame,
  Radio,
  Target,
  Zap,
  Send,
  Eye
} from 'lucide-react';

const TELEGRAM_LINK = 'https://t.me/+pJl61lO3nHlmZGI0';

export default function TipsDoManel() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">

      {/* Cabeçalho da Página */}
      <div className="border-b border-blue-900/30 pb-6">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
          <Star className="w-10 h-10 text-blue-500" />
          Tips do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Manel</span>
        </h1>
        <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
          As entradas e análises do Manel, direto para o grupo do Telegram. Acompanha as apostas e as jogadas escolhidas a dedo.
        </p>
      </div>

      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-1 shadow-[0_0_40px_rgba(37,99,235,0.25)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden">

          {/* Efeitos de fundo (Blurs) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Esquerda: Informação e CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                Acesso Gratuito
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Entra no grupo do <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Manel</span>
                </h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  Tips diretas, sem enrolação. Acompanha as escolhas e as entradas do Manel assim que saem, direto no Telegram.
                </p>
              </div>

              <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-blue-400">
                    <Flame className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Entrada Livre</span>
                  </div>
                  <span className="text-4xl font-black text-white">GRÁTIS</span>
                </div>

                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Send className="w-5 h-5" />
                  Entrar no Grupo
                </a>
                <p className="text-center text-xs text-blue-200/50 mt-3">Acesso imediato ao grupo do Telegram</p>
              </div>
            </div>

            {/* Direita: Imagem do Manel */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/30 shadow-2xl group h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#03091a] via-[#03091a]/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-70"></div>
              <img
                src="/manel.jpg"
                alt="Tips do Manel"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
                {[
                  'Tips diárias do Manel',
                  'Análises rápidas e diretas',
                  'Alertas em tempo real'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <Zap className="w-5 h-5 text-blue-400 shrink-0 fill-blue-400/20" />
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
          <Target className="w-6 h-6 text-blue-500" />
          O que vais encontrar no grupo?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Radio className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Tips em Tempo Real</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Entradas disparadas assim que o Manel encontra a oportunidade. És dos primeiros a saber.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Swords className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Escolhas a Dedo</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Cada tip é selecionada com cuidado, sem spam de apostas — só o que faz sentido entrar.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-blue-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Eye className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Visão de Insider</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Informação direta, sem filtros, do olhar atento do Manel sobre os jogos do dia.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
