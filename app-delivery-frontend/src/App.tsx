import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

// 1. Importando os DOIS componentes de cadastro
import CadastroCliente from "./pages/CadastroCliente";
import CadastroRestaurante from "./pages/CadastroRestaurante"; // <-- NOVO

import Restaurantes from "./pages/Restaurantes";
import Catalogo from "./pages/Catalogo";
import { getUser, clearUser } from "./store/auth";

export default function App() {
  const user = getUser();

  return (
    <div>
      
      <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: '16px' }}>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>Olá, {user.username}</span>
              <button onClick={() => { clearUser(); location.href = "/"; }}>Sair</button>
            </>
          ) : (
            <>
              {/* 2. Adicionado um link para o cadastro de restaurantes */}
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
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        
        {/* 3. Rotas de cadastro separadas */}
        <Route path="/cadastro" element={!user ? <CadastroCliente /> : <Navigate to="/" />} />
        <Route path="/cadastro-restaurante" element={!user ? <CadastroRestaurante /> : <Navigate to="/" />} /> {/* <-- ROTA NOVA */}
        
        {/* --- ROTAS DA APLICAÇÃO --- */}
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/restaurantes/:id" element={<Catalogo />} />

        {/* Rota para qualquer outro caminho, redireciona para a Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
