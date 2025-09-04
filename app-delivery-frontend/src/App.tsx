import { useState } from "react"; // 1. Importamos o useState
import { Routes, Route, Navigate } from "react-router-dom";



//páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Restaurantes from "./pages/Restaurantes";

//páginas de cadastro
import CadastroCliente from "./pages/CadastroCliente";
import CadastroRestaurante from "./pages/CadastroRestaurante";

import Catalogo from "./pages/Catalogo";

//layouts
import PainelLayout from './pages/painel/PainelLayout';
import ClienteLayout from './pages/cliente/ClienteLayout';

import Dashboard from './pages/painel/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import { getUser} from "./store/auth";

export default function App() {
  const [user, setUser] = useState(getUser());

  //Esta função será chamada pelo componente Login para "avisar" o App que o login foi feito
  const handleLoginSuccess = () => {
    setUser(getUser()); 
  };

  

  return (
    
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* --- ROTAS DE AUTENTICAÇÃO --- */}
        <Route 
          path="/login" 
          element={
            !user ? (
              // Se não há usuário, mostra a página de login
              <Login onLoginSuccess={handleLoginSuccess} />
            ) : user.is_restaurante ? (
              // Se há um usuário E ele é restaurante, redireciona para o painel
              <Navigate to="/painel/dashboard" />
            ) : (
              // Se há um usuário E ele é cliente, redireciona para a home
              <Navigate to="/restaurantes" />
            )
          } 
        />
        
        <Route path="/cadastro" element={!user ? <CadastroCliente /> : <Navigate to="/" />} />
        <Route path="/cadastro-restaurante" element={!user ? <CadastroRestaurante /> : <Navigate to="/" />} />
    
        <Route element={<ClienteLayout />}>
          <Route path="/restaurantes" element={<Restaurantes />} />
          <Route path="/restaurantes/:id" element={<Catalogo />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/painel" element={<PainelLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

