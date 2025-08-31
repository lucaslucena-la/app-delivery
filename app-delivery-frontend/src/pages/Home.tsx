import { Link } from "react-router-dom";
import { getUser, clearUser } from "../store/auth";


export default function Home() {
  const user = getUser();

  return (

    //cabeçalho
    <div>

      <h1>Delivery App</h1>
      <p>Bem-vindo! Escolha uma opção:</p>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <Link to="/restaurantes">Ver Restaurantes</Link>
        {user && (
          <button onClick={() => { clearUser(); location.href = "/"; }}>
            Sair ({user.username})
          </button>
        )}
      </div>
    </div>
  );
}
