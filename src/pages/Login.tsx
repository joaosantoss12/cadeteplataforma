import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    const { error } = await signIn(email, password);
    
    if (error) {
      setError('Email ou password incorretos');
      setIsLoading(false);
    } else {
      navigate('/inicio');
    }
  };

  return (
    <div className="min-h-screen bg-[#03091a] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Efeitos de fundo */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl shadow-[0_0_30px_rgba(37,99,235,0.5)] border border-blue-400/30">
                <Star className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
            Cadete
          </h1>
          <p className="text-blue-200/60 mt-2">Plataforma do Cadete</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gradient-to-br from-[#0a1b42] to-[#081533] border border-blue-800/50 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-blue-900/30">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <LogIn className="w-5 h-5 text-blue-400" />
              Iniciar Sessão
            </h2>
            <p className="text-blue-200/60 text-sm mt-1">Bem-vindo de volta!</p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* Erro */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="o.teu@email.com"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/50" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-blue-300/70 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#03091a] border border-blue-900/50 rounded-xl pl-12 pr-12 py-3 text-white placeholder:text-blue-500/40 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400/50 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Esqueci password */}
            <div className="text-right">
              <a href="#" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Esqueceste a password?
              </a>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="p-6 bg-[#03091a]/50 border-t border-blue-900/30 text-center">
            <p className="text-blue-200/60 text-sm">
              Ainda não tens conta?{' '}
              <Link to="/registo" className="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                Cria aqui
              </Link>
            </p>
          </div>
        </div>

        {/* Texto legal */}
        <p className="text-center text-blue-500/40 text-xs mt-6">
          Ao entrar, concordas com os nossos Termos de Serviço e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}
