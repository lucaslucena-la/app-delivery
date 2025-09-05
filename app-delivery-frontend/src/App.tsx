import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas públicas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Restaurantes from "./pages/Restaurantes";
import Catalogo from "./pages/Catalogo";

// Páginas de cadastro
import CadastroCliente from "./pages/CadastroCliente";
import CadastroRestaurante from "./pages/CadastroRestaurante";

// Layouts e componentes de proteção
import PainelLayout from './pages/servidor/PainelLayout';
import ClienteLayout from './pages/cliente/ClienteLayout';
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas do Painel do Restaurante
import Dashboard from './pages/servidor/Dashboard';
// --- 1. Importe a nova página aqui ---
import { GerenciarCardapio } from './pages/servidor/GerenciarCardapio'; 

// Lógica de autenticação
import { getUser } from "./store/auth";

export default function App() {
  const [user, setUser] = useState(getUser());

  // Esta função será chamada pelo componente Login para "avisar" o App que o login foi feito
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
    
        {/* --- ROTAS DO CLIENTE --- */}
        <Route element={<ClienteLayout />}>
          <Route path="/restaurantes" element={<Restaurantes />} />
          <Route path="/restaurantes/:id" element={<Catalogo />} />
        </Route>

        {/* --- ROTAS PROTEGIDAS DO PAINEL DO RESTAURANTE --- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/painel" element={<PainelLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="cardapio" element={<GerenciarCardapio />} />
          </Route>
        </Route>

        {/* Rota "catch-all" para redirecionar qualquer caminho não encontrado */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}