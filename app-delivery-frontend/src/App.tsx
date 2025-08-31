import { Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Restaurantes from "./pages/Restaurantes";
import Catalogo from "./pages/Catalogo";
import CriarRestaurante from "./pages/CriarRestaurante";
import { getUser, clearUser } from "./store/auth";

export default function App() {
  const user = getUser();

  return (
    <div>
      
      <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <div style={{ marginLeft: "auto" }}>
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>Olá, {user.username}</span>
              <button onClick={() => { clearUser(); location.href = "/"; }}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
              <Link to="/cadastro">Cadastro</Link>
            </>
          )}
        </div>
      </header>

      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/cadastro" element={!user ? <Cadastro /> : <Navigate to="/" />} />
        <Route path="/restaurantes" element={<Restaurantes />} />
        <Route path="/restaurantes/:id" element={<Catalogo />} />

        {/* etapa 2: criar registro na tabela restaurante */}
        <Route
          path="/meu-restaurante/criar"
          element={user ? <CriarRestaurante /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
