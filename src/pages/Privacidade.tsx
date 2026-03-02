import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Privacidade() {
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
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">Política de Privacidade</h1>
        </div>

        {/* Conteúdo */}
        <div className="bg-[#081533] border border-blue-900/40 rounded-2xl p-6 md:p-8 space-y-6 text-blue-200/80">
          
          <p className="text-sm text-blue-400">Última atualização: 2 de Março de 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Informação que Recolhemos</h2>
            <p>Recolhemos informação que nos forneces diretamente, incluindo:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Nome e endereço de email</li>
              <li>Informação de pagamento (processada por terceiros seguros)</li>
              <li>Dados de utilização da plataforma</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. Como Utilizamos a Informação</h2>
            <p>Utilizamos a informação recolhida para:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Fornecer e manter os nossos serviços</li>
              <li>Processar transações e enviar notificações relacionadas</li>
              <li>Melhorar e personalizar a experiência do utilizador</li>
              <li>Comunicar atualizações e novidades relevantes</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Partilha de Informação</h2>
            <p>Não vendemos nem partilhamos os teus dados pessoais com terceiros, exceto:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Com o teu consentimento explícito</li>
              <li>Para processamento de pagamentos (Stripe)</li>
              <li>Quando exigido por lei</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Segurança dos Dados</h2>
            <p>Implementamos medidas de segurança técnicas e organizacionais para proteger os teus dados contra acesso não autorizado, alteração ou destruição.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Cookies</h2>
            <p>Utilizamos cookies essenciais para o funcionamento da plataforma e cookies de análise para melhorar a experiência. Podes gerir as preferências de cookies no teu navegador.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Os Teus Direitos</h2>
            <p>Tens direito a:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Aceder aos teus dados pessoais</li>
              <li>Corrigir dados incorretos</li>
              <li>Solicitar a eliminação dos teus dados</li>
              <li>Retirar o consentimento a qualquer momento</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Retenção de Dados</h2>
            <p>Mantemos os teus dados enquanto a tua conta estiver ativa ou conforme necessário para cumprir obrigações legais.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Alterações a Esta Política</h2>
            <p>Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas através da plataforma ou por email.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">9. Contacto</h2>
            <p>Para questões sobre privacidade, contacta-nos através do suporte no Telegram.</p>
          </section>

        </div>
      </div>
    </div>
  );
}
