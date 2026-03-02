import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

export default function Termos() {
  return (
    <div className="min-h-screen bg-[#03091a] p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Voltar */}
        <Link to="/registo" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Termos de Serviço</h1>
        </div>

        {/* Conteúdo */}
        <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 md:p-8 space-y-6 text-blue-200/80">
          
          <p className="text-sm text-blue-400">Última atualização: 2 de Março de 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Aceitação dos Termos</h2>
            <p>Ao aceder e utilizar a plataforma Cadete, aceitas cumprir estes Termos de Serviço. Se não concordares com alguma parte, não deves utilizar os nossos serviços.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Descrição do Serviço</h2>
            <p>A Cadete é uma plataforma educacional que fornece análises desportivas, gestão de banca e conteúdo informativo relacionado com apostas desportivas. Toda a informação disponibilizada tem caráter meramente educacional e informativo.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Responsabilidade do Utilizador</h2>
            <p>O utilizador é totalmente responsável pelas suas decisões financeiras. A Cadete não garante lucros nem se responsabiliza por perdas decorrentes de apostas. Apostas desportivas envolvem risco e deves apostar apenas o que podes perder.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Idade Mínima</h2>
            <p>Para usar os serviços da Cadete, deves ter pelo menos 18 anos de idade. Ao registares-te, confirmas que tens a idade legal para participar em atividades relacionadas com apostas no teu país.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Conta de Utilizador</h2>
            <p>És responsável por manter a confidencialidade da tua conta e password. Notifica-nos imediatamente de qualquer uso não autorizado.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Pagamentos e Reembolsos</h2>
            <p>Os pagamentos são processados de forma segura. Não oferecemos reembolsos após a ativação do acesso aos conteúdos premium, exceto em casos excecionais avaliados individualmente.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Propriedade Intelectual</h2>
            <p>Todo o conteúdo da plataforma é propriedade da Cadete. Não é permitida a reprodução, distribuição ou partilha de conteúdos sem autorização prévia.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Alterações aos Termos</h2>
            <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações serão comunicadas através da plataforma.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">9. Contacto</h2>
            <p>Para questões relacionadas com estes termos, contacta-nos através do suporte no Telegram.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
