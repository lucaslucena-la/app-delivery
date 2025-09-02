import { useState } from "react";
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";

export default function CadastroRestaurante() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // 1. Adicionamos os estados para os novos campos
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    
    try {
      // 3. Enviamos os novos dados no payload da requisição
      await registerRequest({ 
        username, 
        email, 
        password, 
        is_restaurante: true,
        endereco, // <-- Novo
        telefone  // <-- Novo
      });
      
      setMsg("Cadastro realizado! Você será levado ao login.");
      
      setTimeout(() => navigate("/restaurante/login"), 1500); 
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "4rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Cadastre seu Restaurante</h2>
      <p>Crie sua conta de parceiro com as informações principais do seu estabelecimento.</p>
      
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 16 }}>
        <label>
          Nome do Restaurante (será usado no login)
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="restaurante_legal" required />
        </label>
        
        <label>
          E-mail de Contato
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@restaurante.com" required />
        </label>

        {/* 2. Adicionamos os novos campos ao formulário */}
        <label>
          Endereço Completo
          <input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua das Flores, 123, Centro" required />
        </label>

        <label>
          Telefone para Contato
          <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 98765-4321" required />
        </label>

        <label>
          Senha de Acesso
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
        </label>

        <button type="submit">Criar Conta de Parceiro</button>

        {msg && <p style={{ color: "green" }}>{msg}</p>}
        {err && <p style={{ color: "crimson" }}>{err}</p>}
      </form>

      <p style={{ marginTop: 12 }}>
        Já é parceiro? <Link to="/restaurante/login">Faça o login aqui</Link>
      </p>
    </div>
  );
}

