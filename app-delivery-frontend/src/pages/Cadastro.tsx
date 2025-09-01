import { useState } from "react";
import { registerRequest } from "../services/auth"; // função que chama API de cadastro
import { useNavigate, Link } from "react-router-dom"; // navegação entre páginas

// Componente de página de cadastro de usuário
export default function Cadastro() {
  // Estados do formulário
  const [username, setUsername] = useState("");     // guarda nome de usuário
  const [email, setEmail]       = useState("");     // guarda email
  const [password, setPassword] = useState("");     // guarda senha
  const [isRest, setIsRest]     = useState(false);  // checkbox "sou restaurante"
  
  // Estados auxiliares
  const [msg, setMsg] = useState<string | null>(null); // mensagem de sucesso
  const [err, setErr] = useState<string | null>(null); // mensagem de erro
  
  const navigate = useNavigate(); // hook p/ redirecionar usuário

  // Função chamada ao enviar o formulário
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); // evita recarregar a página
    setMsg(null); setErr(null); // reseta mensagens
    
    try {
      // chamada para API com dados do formulário
      await registerRequest({ username, email, password, is_restaurante: isRest });
      
      // mensagem de feedback positivo
      setMsg("Cadastro realizado! Faça login para continuar.");
      
      // redireciona automaticamente para /login após 800ms
      setTimeout(() => navigate("/login"), 800);
    } catch (e: any) {
      // captura erro vindo da API e exibe
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div 
      style={{ maxWidth: 420, margin: "4rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}
    >
      <h2>Cadastro</h2>
      
      {/* Formulário de cadastro */}
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        
        {/* Campo de usuário */}
        <label>
          Usuário
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="joao123" 
          />
        </label>
        
        {/* Campo de email */}
        <label>
          E-mail
          <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            placeholder="email@exemplo.com" 
          />
        </label>

        {/* Campo de senha */}
        <label>
          Senha
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
          />
        </label>

        {/* Checkbox para marcar conta como "restaurante" */}
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input 
            type="checkbox" 
            checked={isRest} 
            onChange={e => setIsRest(e.target.checked)} 
          />
          Sou restaurante
        </label>

        {/* Botão de submit */}
        <button type="submit">Cadastrar</button>

        {/* Mensagens de feedback */}
        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>

      {/* Link alternativo para login */}
      <p style={{ marginTop: 12 }}>
        Já tem conta? <Link to="/login">Fazer login</Link>
      </p>
    </div>
  );
}
