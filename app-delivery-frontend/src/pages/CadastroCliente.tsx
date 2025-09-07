import { useState } from "react";
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Cadastro.module.css";

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
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link to="/" className={styles.navLink}>Home</Link>
      </header>
      
      <div className={styles.card}>
        <h2 className={styles.title}>Crie sua Conta</h2>
        <p className={styles.subtitle}>Cadastre-se para começar a pedir.</p>
        
        <form onSubmit={onSubmit} className={styles.form}>
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
