import { useState } from "react";
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function CadastroCliente() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    
    try {
      // Chamada para API com is_restaurante: false fixo.
      await registerRequest({ username, email, password, is_restaurante: false });
      
      setMsg("Cadastro realizado! Você será redirecionado para o login.");
      
      // Redireciona para o login do cliente após 1 segundo
      setTimeout(() => navigate("/login"), 1000);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Crie sua Conta</h2>
      <p>Cadastre-se para começar a pedir.</p>
      
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Nome de Usuário
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="joao123" required />
        </label>
        
        <label>
          E-mail
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" required />
        </label>

        <label>
          Senha
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
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
