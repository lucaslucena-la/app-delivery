import { Link } from "react-router-dom";
import { getUser, clearUser } from "../store/auth";
import { useState } from "react"; // 1. Importamos o useState



// Função de logout para limpar o estado e o localStorage

export default function Home() {
  const [user, setUser] = useState(getUser());
  
  const handleLogout = () => {
    clearUser();
    setUser(null);
  };
  
  return (

    //cabeçalho
    <div>

      <header style={{ padding: 12, borderBottom: "1px solid #eee", display: "flex", gap: 12, alignItems: "center" }}>
        <Link to="/">Home</Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: '16px' }}>
          
          {user ? (
            <>
              <span style={{ marginRight: 8 }}>Olá, {user.username}</span>
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

      <h1>Delivery App</h1>
      <p>Bem-vindo! Escolha uma opção:</p>

      <div>
        <Link to="/restaurantes">Ver Restaurantes</Link>
      </div>
    </div>
  );
}
