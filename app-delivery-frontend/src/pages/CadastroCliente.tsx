import { useState } from "react";
import { registerRequest } from "../services/auth.ts";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Cadastro.module.css";

export default function CadastroCliente() {
  // --- NOVOS ESTADOS para os novos campos ---
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState(""); // Adicionado telefone, que também é útil
  
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
      // --- ALTERADO: Enviando os novos campos na chamada da API ---
      await registerRequest({ 
        // Dados do Cliente
        nome_completo: nomeCompleto,
        cpf,
        telefone,
        // Dados do Usuário
        username, 
        email, 
        password, 
        is_restaurante: false 
      });
      
      setMsg("Cadastro realizado! Você será redirecionado para o login.");
      
      // Redireciona para o login do cliente após 2 segundos
      setTimeout(() => navigate("/login"), 2000);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link to="/" className={styles.navLink}>Home</Link>
      </header>
      
      <div className={styles.card}>
        <h2 className={styles.title}>Crie sua Conta</h2>
        <p className={styles.subtitle}>Cadastre-se para começar a pedir.</p>
        
        <form onSubmit={onSubmit} className={styles.form}>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="nomeCompleto">Nome Completo</label>
            <input id="nomeCompleto" className={styles.input} value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} placeholder="Seu nome completo" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="cpf">CPF</label>
            <input id="cpf" className={styles.input} value={cpf} onChange={e => setCpf(e.target.value)} placeholder="000.000.000-00" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="telefone">Telefone</label>
            <input id="telefone" type="tel" className={styles.input} value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(00) 00000-0000" />
          </div>
          
          <hr style={{width: '100%', border: 'none', borderBottom: '1px solid #eee', margin: '1rem 0'}} />

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">Nome de Usuário</label>
            <input id="username" className={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="joao123" required />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">E-mail</label>
            <input id="email" className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Senha</label>
            <input id="password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <button type="submit" className={styles.button}>Cadastrar</button>

          {msg && <p className={`${styles.feedbackMessage} ${styles.success}`}>{msg}</p>}
          {err && <p className={`${styles.feedbackMessage} ${styles.error}`}>{err}</p>}
        </form>

        <p className={styles.loginPrompt}>
          Já tem conta? <Link to="/login" className={styles.loginLink}>Fazer login</Link>
        </p>
      </div>
    </div>
  );
}

