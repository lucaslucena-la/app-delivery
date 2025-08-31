import { useState } from "react";
import { loginRequest } from "../services/auth";
import { saveUser } from "../store/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const { user } = await loginRequest({ username, password });
      saveUser(user);
      navigate("/restaurantes");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha no login");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "4rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Login</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Usuário
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="joao123" />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </label>
        <button type="submit">Entrar</button>
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </form>
    </div>
  );
}
