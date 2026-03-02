import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Estadios from './pages/Estadios';
import Submundo from './pages/Submundo';
import Desafios from './pages/Desafios';
import Subscricoes from './pages/Subscricoes';
import AnaliseDia from './pages/AnaliseDia';
import AnalisePremium from './pages/AnalisePremium';
import CapitansBet from './pages/CapitansBet';
import GestaoBanca from './pages/GestaoBanca';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Registo from './pages/Registo';
import Termos from './pages/Termos';
import Privacidade from './pages/Privacidade';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect raiz para início */}
        <Route path="/" element={<Navigate to="/inicio" replace />} />
        
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
            <Route path="/estadios" element={<Estadios />} />
            <Route path="/submundo" element={<Submundo />} />
            <Route path="/desafios" element={<Desafios />} />
            <Route path="/subscricoes" element={<Subscricoes />} />
            <Route path="/analise-dia" element={<AnaliseDia />} />
            <Route path="/analise-premium" element={<AnalisePremium />} />
            <Route path="/capitansbet" element={<CapitansBet />} />
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;