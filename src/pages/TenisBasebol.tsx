import {
  Trophy,
  Zap,
  Send,
  Target,
  Activity,
  TrendingUp,
  CheckCircle2,
  Award,
  Flame
} from 'lucide-react';

const TELEGRAM_LINK = 'https://t.me/+vCEfAW17SsAxMDQ0';

export default function Tenis() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-16">

      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-blue-900/30 pb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
            <Activity className="w-10 h-10 text-amber-400" />
            Cadete no <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-lime-400">Ténis</span>
          </h1>
          <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
            Sai do futebol e diversifica. Análises e apostas focadas no ténis, um desporto cheio de valor e oportunidades escondidas do grande público.
          </p>
        </div>

        {/* Badge Lateral Informativa */}
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-amber-500/30 p-5 rounded-2xl flex items-center gap-4 shrink-0 shadow-[0_0_20px_rgba(245,158,11,0.12)]">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/30 shrink-0">
            <Award className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-amber-400/80 uppercase tracking-widest">Modalidade</p>
            <p className="text-lg font-black text-white">Ténis</p>
          </div>
        </div>
      </div>

      {/* Banner Principal */}
      <div className="bg-gradient-to-r from-amber-500 to-lime-500 rounded-3xl p-1 shadow-[0_0_40px_rgba(245,158,11,0.2)]">
        <div className="bg-[#03091a] rounded-[22px] p-8 md:p-12 relative overflow-hidden">

          {/* Efeitos de fundo (Blurs) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-lime-500/10 blur-[100px] rounded-full pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

            {/* Esquerda: Informação e CTA */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                Acesso Gratuito
              </div>

              <div>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                  Um Desporto, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-lime-400">Todo o Ano</span>
                </h2>
                <p className="text-blue-200/80 text-lg leading-relaxed">
                  O ténis oferece mercados líquidos e cheios de valor, com jogos praticamente todos os dias. Deixa o Cadete guiar as tuas entradas nesta modalidade.
                </p>
              </div>

              <div className="bg-[#081533]/80 border border-blue-900/40 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-amber-400">
                    <Flame className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase tracking-widest">Entrada Livre</span>
                  </div>
                  <span className="text-4xl font-black text-white">GRÁTIS</span>
                </div>

                <a
                  href={TELEGRAM_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-black text-[#03091a] bg-gradient-to-r from-amber-400 to-lime-400 hover:from-amber-300 hover:to-lime-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wide"
                >
                  <Send className="w-5 h-5" />
                  Entrar no Grupo
                </a>
                <p className="text-center text-xs text-blue-200/50 mt-3">Acesso imediato ao grupo do Telegram</p>
              </div>
            </div>

            {/* Direita: Imagem */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl group h-full min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#03091a] via-[#03091a]/40 to-transparent opacity-90 z-10 transition-opacity group-hover:opacity-70"></div>
              <img
                src="/cadete_main.jpeg"
                alt="Cadete no Ténis"
                className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20 space-y-3">
                {[
                  'Palpites de ténis (ATP, WTA & Grand Slams)',
                  'Análises de jogos e superfícies',
                  'Mercados de valor com odds trabalhadas'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-lg p-3 border border-white/10">
                    <Zap className="w-5 h-5 text-amber-400 shrink-0 fill-amber-400/20" />
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
          <Target className="w-6 h-6 text-amber-400" />
          Porquê apostar em ténis?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Ténis Todo o Ano</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Um desporto que nunca pára. Torneios ATP, WTA e os grandes Grand Slams com dezenas de jogos por dia para explorar.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Estatística ao Detalhe</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Head-to-heads, forma recente e superfícies dão um terreno perfeito para apostas fundamentadas em dados.
            </p>
          </div>

          <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 hover:border-amber-500/50 transition-all group">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-4 border border-amber-500/20 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Diversifica a Banca</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">
              Não dependas só do futebol. Espalhar o risco por vários desportos é um dos segredos do apostador consistente.
            </p>
          </div>
        </div>

        {/* Rodapé com destaque */}
        <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-5 mt-4">
          <CheckCircle2 className="w-6 h-6 text-amber-400 shrink-0" />
          <p className="text-blue-200/80 text-sm">
            Grupo <span className="font-bold text-amber-400">100% gratuito</span> — entra, acompanha as entradas e leva o Cadete para além do futebol.
          </p>
        </div>
      </div>

    </div>
  );
}
