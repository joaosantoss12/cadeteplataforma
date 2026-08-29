import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Desafios from './pages/Desafios';
import AnalisePremium from './pages/AnalisePremium';
import Coldbet from './pages/Coldbet';
import GestaoBanca from './pages/GestaoBanca';
import AbaixoDe3 from './pages/Mundial2026';
import TipsDaBruna from './pages/Submundo';
import Tenis from './pages/TenisBasebol';
import TipsDoManel from './pages/TipsDoManel';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Registo from './pages/Registo';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade'; 

// Redirects old /dashboard?payment=success&plan=X to the correct page
function DashboardPaymentRedirect() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const plan = params.get('plan');
  const payment = params.get('payment');

  if (payment === 'success') {
    if (plan === 'analise_premium') {
      return <Navigate to={`/analise-premium?payment=success&plan=analise_premium`} replace />;
    }
    if (plan === 'desafios') {
      return <Navigate to={`/desafios?payment=success&plan=desafios`} replace />;
    }
    if (plan === 'abaixo_de_3') {
      window.location.href = "https://t.me/+_E6Ayd35ZLY0NGM8";
      return null;
    }
  }
  return <Navigate to="/inicio" replace />;
}
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect raiz para início */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        {/* Legacy Stripe redirect fallback */}
        <Route path="/dashboard" element={<DashboardPaymentRedirect />} />
        
        {/* Páginas de Autenticação */}
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        
        {/* Páginas Legais */}
        <Route path="/termos" element={<Termos />} />
        <Route path="/privacidade" element={<Privacidade />} />
        
        {/* Dashboard protegido */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/inicio" element={<Dashboard />} />
            <Route path="/gestao" element={<GestaoBanca />} />
            <Route path="/desafios" element={<Desafios />} />
            <Route path="/analise-premium" element={<AnalisePremium />} />
            <Route path="/coldbet" element={<Coldbet />} />
            {/* Legacy path redirects */}
            <Route path="/capitansbet" element={<Navigate to="/coldbet" replace />} />
            <Route path="/ivibet" element={<Navigate to="/coldbet" replace />} />
            <Route path="/abaixo-de-3" element={<AbaixoDe3 />} />
            {/* Legacy path redirect */}
            <Route path="/mundial-2026" element={<Navigate to="/abaixo-de-3" replace />} />
            <Route path="/submundo" element={<TipsDaBruna />} />
            <Route path="/tenis-basebol" element={<Tenis />} />
            <Route path="/tips-do-manel" element={<TipsDoManel />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
