import { 
  CheckCircle2, 
  CreditCard, 
  Crown, 
  ShieldCheck, 
  Zap, 
  Star 
} from 'lucide-react';

export default function Subscricoes() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-16">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
          <Crown className="w-10 h-10 text-blue-500" />
          Acesso direto ao grupo de <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Desafios</span>
        </h1>
        <p className="mt-3 text-blue-200/70 max-w-2xl text-lg">
          Escolhe o plano que melhor se adapta à tua banca. Todos os planos dão acesso integral a todas as ferramentas, análises e ao grupo exclusivo.
        </p>
      </div>

      {/* --- ZONA DE GESTÃO DA SUBSCRIÇÃO ATUAL --- */}
      <div className="bg-[#081533]/80 border border-emerald-900/50 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Fundo de brilho suave */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex items-center gap-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <ShieldCheck className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">Estado: Ativo</h3>
                </div>
                <p className="text-2xl font-black text-white">Plano Mensal</p>
                <p className="text-sm text-blue-200/60 mt-1">Próxima renovação a 28 de Março de 2026 (29,99€)</p>
            </div>
        </div>

        <div className="relative z-10 w-full md:w-auto">
            <button className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#03091a] hover:bg-[#0a1b42] text-white border border-blue-800/50 font-bold py-4 px-6 rounded-xl transition-colors shadow-lg">
                <CreditCard className="w-5 h-5 text-blue-400" />
                Gerir Assinatura no Stripe
            </button>
        </div>
      </div>

      {/* --- CARTÕES DE PREÇO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pt-6">
        
        {/* PLANO MENSAL */}
        <div className="bg-[#081533] border border-blue-900/40 rounded-3xl p-8 shadow-lg flex flex-col relative group hover:border-blue-700/50 transition-all duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Mensal</h3>
                <p className="text-blue-200/60 text-sm">Ideal para testar as águas e conhecer o nosso método de trabalho.</p>
            </div>
            <div className="mb-8">
                <span className="text-5xl font-black text-white">29€</span>
                <span className="text-blue-400/60 font-medium">/mês</span>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
                {['Acesso ao Grupo de Desafios (Telegram)', 'Análises Estádios & Submundo', 'Desafios de Alavancagem', 'Suporte Prioritário'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-blue-100/90 text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <button className="w-full py-4 rounded-xl font-bold text-white bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 transition-colors">
                Subscrever Mensal
            </button>
        </div>

        {/* PLANO TRIMESTRAL (DESTAQUE / RECOMENDADO) */}
        <div className="bg-gradient-to-b from-[#0a1b42] to-[#081533] border-2 border-indigo-500/50 rounded-3xl p-8 shadow-[0_0_40px_rgba(79,70,229,0.15)] flex flex-col relative transform md:-translate-y-4">
            
            {/* Badge de Destaque */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase tracking-widest py-1.5 px-4 rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <Star className="w-3.5 h-3.5 fill-white" />
                Mais Escolhido
            </div>

            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Trimestral</h3>
                <p className="text-blue-200/60 text-sm">Compromisso a médio prazo para construção real de banca com juros compostos.</p>
            </div>
            <div className="mb-8 relative">
                <span className="text-5xl font-black text-white">69€</span>
                <span className="text-blue-400/60 font-medium">/3 meses</span>
                <div className="absolute -right-2 top-0 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    POUPAS 18€
                </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
                {['Acesso ao Grupo de Desafios (Telegram)', 'Análises Estádios & Submundo', 'Desafios de Alavancagem', 'Suporte Prioritário', 'Gestão de Banca Exclusiva'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 fill-indigo-400/20" />
                        <span className="text-white text-sm font-medium">{feature}</span>
                    </li>
                ))}
            </ul>

            <button className="w-full py-4 rounded-xl font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] transition-all transform hover:-translate-y-1">
                Subscrever Trimestral
            </button>
        </div>

        {/* PLANO ANUAL */}
        <div className="bg-[#081533] border border-blue-900/40 rounded-3xl p-8 shadow-lg flex flex-col relative group hover:border-blue-700/50 transition-all duration-300">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Anual</h3>
                <p className="text-blue-200/60 text-sm">Para apostadores sérios que tratam isto como um investimento anual.</p>
            </div>
            <div className="mb-8 relative">
                <span className="text-5xl font-black text-white">199€</span>
                <span className="text-blue-400/60 font-medium">/ano</span>
                <div className="absolute -right-2 top-0 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    POUPAS 149€
                </div>
            </div>
            
            <ul className="space-y-4 mb-8 flex-1">
                {['Acesso ao Grupo de Desafios (Telegram)', 'Análises Estádios & Submundo', 'Desafios de Alavancagem', 'Suporte Prioritário', 'Mentoria / Chamada Inicial'].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-blue-100/90 text-sm">{feature}</span>
                    </li>
                ))}
            </ul>

            <button className="w-full py-4 rounded-xl font-bold text-white bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 transition-colors">
                Subscrever Anual
            </button>
        </div>

      </div>

    </div>
  );
}