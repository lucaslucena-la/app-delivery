import { useState } from "react"; // 1. Importamos o useState
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import CadastroCliente from "./pages/CadastroCliente";
import CadastroRestaurante from "./pages/CadastroRestaurante";
import Restaurantes from "./pages/Restaurantes";
import Catalogo from "./pages/Catalogo";
import PainelLayout from './pages/painel/PainelLayout';
import Dashboard from './pages/painel/Dashboard';
import ProtectedRoute from "./components/ProtectedRoute";
import { getUser, clearUser } from "./store/auth";

export default function App() {
  // 2. Usamos useState para tornar o 'user' uma variável de estado reativa
  const [user, setUser] = useState(getUser());

  // 3. Esta função será chamada pelo componente Login para "avisar" o App que o login foi feito
  const handleLoginSuccess = () => {
    setUser(getUser()); // Re-lê os dados do localStorage e atualiza o estado
  };

  // 4. Função de logout para limpar o estado e o localStorage
  const handleLogout = () => {
    clearUser();
    setUser(null);
  };

  return (
    <div>
      <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: '16px' }}>
          {/* O header agora lê do ESTADO 'user', não mais diretamente do localStorage */}
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>Olá, {user.username}</span>
              {/* O botão de sair agora chama a nova função handleLogout */}
              <button onClick={handleLogout}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
              <Link to="/cadastro">Cadastro Cliente</Link>
              <span style={{ borderLeft: '1px solid #ccc', height: '20px' }}></span>
              <Link to="/cadastro-restaurante">Seja um Parceiro</Link>
            </>
          )}
        </div>
      </header>
    
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
              <Navigate to="/" />
            )
          } 
        />
        
        <Route path="/cadastro" element={!user ? <CadastroCliente /> : <Navigate to="/" />} />
        <Route path="/cadastro-restaurante" element={!user ? <CadastroRestaurante /> : <Navigate to="/" />} />
        
        {/* --- ROTAS DA APLICAÇÃO --- */}
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/restaurantes/:id" element={<Catalogo />} />

        {/* --- ROTAS PROTEGIDAS DO PAINEL --- */}
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

