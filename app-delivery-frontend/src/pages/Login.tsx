import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../services/auth";
import { saveUser } from "../store/auth";

// 1. Definimos o tipo das "props" que o componente espera receber.
//    Neste caso, ele espera uma função chamada 'onLoginSuccess'.
type LoginProps = {
  onLoginSuccess: () => void;
};

// 2. O componente agora recebe as props. Usamos a desestruturação { onLoginSuccess }.
export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null);
    setLoading(true);
    
    try {
      const response = await loginRequest({username, password});

      if (response.user) {
        // Salva os dados do usuário no localStorage
        saveUser(response.user);

        onLoginSuccess();

        
      }
    } catch(err: any) {
      // Corrigi um pequeno erro de digitação aqui (era 'reponse')
      setError(err?.response?.data?.message || "Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Seu JSX do formulário continua exatamente o mesmo
    <div>
      <div style={{ maxWidth: 360, margin: "4rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Acessar minha conta</h2>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
          <label>
            Usuário
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Seu nome de usuário" required />
          </label>
          <label>
            Senha
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </label>
          <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
          {error && <p style={{ color: "crimson" }}>{error}</p>}
          <p style={{ marginTop: 24, textAlign: 'center', color: '#6b7280' }}>
            Ainda não tem uma conta?
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
            <Link to="/cadastro">Criar conta de Cliente</Link>
            <Link to="/cadastro-restaurante">Cadastrar meu Restaurante</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

