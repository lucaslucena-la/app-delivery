import { useState } from "react";
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Cadastro() {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isRest, setIsRest]     = useState(false);
  const [msg, setMsg]           = useState<string | null>(null);
  const [err, setErr]           = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await registerRequest({ username, email, password, is_restaurante: isRest });
      setMsg("Cadastro realizado! Faça login para continuar.");
      setTimeout(() => navigate("/login"), 800);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Cadastro</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Usuário
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="joao123" />
        </label>
        
        <label>
          E-mail
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </label>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={isRest} onChange={e => setIsRest(e.target.checked)} />
          Sou restaurante
        </label>

        <button type="submit">Cadastrar</button>
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>
    </div>
  );
}
