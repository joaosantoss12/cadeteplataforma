import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  Trophy,
  LogOut, 
  Star,
  FileText,
  ChevronDown,
  Sparkles,
  LineChart,
  Bell,
  Menu, // Ícone do hambúrguer
  X, // Ícone para fechar
  Shield // Ícone Admin
} from 'lucide-react';
import SocialProofNotifications from '../components/SocialProofNotifications';
import { useAuth } from '../contexts/AuthContext';

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  
  // Estados para menus
  const [analisesOpen, setAnalisesOpen] = useState(false);
  // Preferência de notificações persistida no localStorage
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(
    () => localStorage.getItem('notificacoesAtivas') !== 'false'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Estado do Mobile Menu

  // Guarda a preferência sempre que muda
  useEffect(() => {
    localStorage.setItem('notificacoesAtivas', String(notificacoesAtivas));
  }, [notificacoesAtivas]);

  const menuItems = [
    { name: 'Início', path: '/inicio', icon: LayoutDashboard },
    { name: 'Gestão de Banca', path: '/gestao', icon: LineChart },
    { name: 'Desafios do Cadete', path: '/desafios', icon: Trophy },
    { name: 'SpinAndFlix Casino', path: '/capitansbet', icon: Sparkles },
  ];

  const analisesItems = [
    { name: 'Análise do Dia', path: '/analise-dia' },
    { name: 'Análise Premium', path: '/analise-premium' }
  ];

  const isAnalisesActive = analisesItems.some(item => location.pathname === item.path);

  useEffect(() => {
    if (isAnalisesActive) {
      setAnalisesOpen(true);
    }
  }, [isAnalisesActive]);

  // Fecha o menu mobile sempre que a rota mudar
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const getCurrentPageName = () => {
    const mainItem = menuItems.find(item => item.path === location.pathname);
    if (mainItem) return mainItem.name;
    const analiseItem = analisesItems.find(item => item.path === location.pathname);
    if (analiseItem) return analiseItem.name;
    return 'Área de Membros';
  };

  return (
    <div className="flex h-screen bg-[#03091a] text-slate-100 selection:bg-blue-500/30 overflow-hidden">
      
      {/* Overlay para Mobile (Fechar ao clicar fora) */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#081533] border-r border-blue-900/40 flex flex-col 
        transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex
      `}>
        
        {/* Logotipo e Botão de Fechar (Mobile) */}
        <div className="h-24 flex items-center justify-between px-6 border-b border-blue-900/40 bg-gradient-to-r from-blue-950/30 to-indigo-950/30">
          <div className="flex items-center gap-3 w-full">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.5)] border border-blue-400/30">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[9px] font-black text-blue-400/80 uppercase tracking-[0.15em] mb-1.5">Plataforma do</span>
              <span className="text-2xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-500">Cadete</span>
            </div>
          </div>
          
          {/* Botão para fechar (Mobile) */}
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden p-2 text-blue-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Principal */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)} // Fecha ao clicar no item
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                    : 'text-blue-100/60 hover:bg-blue-900/30 hover:text-blue-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-white' : 'text-blue-400/50'}`} />
                {item.name}
              </Link>
            );
          })}

          {/* Menu Análises */}
          <div className="space-y-1">
            <button
              onClick={() => setAnalisesOpen(!analisesOpen)}
              className={`flex items-center justify-between w-full px-3 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                isAnalisesActive 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold' 
                  : 'text-blue-100/60 hover:bg-blue-900/30 hover:text-blue-50'
              }`}
            >
              <div className="flex items-center">
                <FileText className={`w-5 h-5 mr-3 ${isAnalisesActive ? 'text-white' : 'text-blue-400/50'}`} />
                Análises
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${analisesOpen ? 'rotate-180' : ''}`} />
            </button>

            {analisesOpen && (
              <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                {analisesItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)} // Fecha ao clicar no sub-item
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                        isActive 
                          ? 'bg-blue-900/50 text-white font-semibold border-l-2 border-blue-400' 
                          : 'text-blue-200/60 hover:bg-blue-900/20 hover:text-blue-100 border-l-2 border-transparent'
                      }`}
                    >
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Link Admin (apenas para admins) */}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 mt-4 ${location.pathname === '/admin' 
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold shadow-[0_0_20px_rgba(234,179,8,0.3)]' 
                : 'text-yellow-400/80 hover:bg-yellow-900/20 hover:text-yellow-300 border border-yellow-500/30'
              }`}
            >
              <Shield className={`w-5 h-5 mr-3 ${location.pathname === '/admin' ? 'text-white' : 'text-yellow-400/70'}`} />
              Painel Admin
            </Link>
          )}
        </nav>

        {/* Rodapé da Sidebar */}
        <div className="border-t border-blue-900/40 p-4 space-y-3">
          <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-blue-900/20">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400/70" />
              <span className="text-sm text-blue-200/70">Notificações</span>
            </div>
            <button
              onClick={() => setNotificacoesAtivas(!notificacoesAtivas)}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                notificacoesAtivas ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-blue-900/50'
              }`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${notificacoesAtivas ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          <button 
            onClick={async () => {
              await signOut();
              navigate('/login');
            }}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-blue-300/70 rounded-lg hover:bg-red-950/40 hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 text-blue-400/50 group-hover:text-red-500" />
            Sair da Conta
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col overflow-hidden bg-transparent w-full">
        
        {/* Cabeçalho */}
        <header className="h-16 bg-[#081533]/80 backdrop-blur-md border-b border-blue-900/40 flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Botão Hamburguer - Apenas Mobile */}
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden p-2 text-blue-100 hover:bg-blue-900/30 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg md:text-xl font-bold text-blue-50 truncate">
              {getCurrentPageName()}
            </h2>
          </div>
        </header>

        {/* Conteúdo Dinâmico */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Notificações de Social Proof */}
      {notificacoesAtivas && <SocialProofNotifications />}

    </div>
  );
            }
