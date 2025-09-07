import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginRequest } from "../services/auth";
import { saveUser } from "../store/auth";
import styles from './Login.module.css'; // Importa o nosso novo CSS

type LoginProps = {
  onLoginSuccess: () => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const response = await loginRequest({ username, password });
      if (response.user) {
        saveUser(response.user);
        onLoginSuccess();
      }
    } catch(err: any) {
      setError(err?.response?.data?.message || "Usuário ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <Link to="/" className={styles.navLink}>Home</Link>
        <div className={styles.headerNav}>
          <Link to="/cadastro" className={styles.navLink}>Cadastro Cliente</Link>
          <span className={styles.navSeparator}></span>
          <Link to="/cadastro-restaurante" className={styles.navLink}>Seja um Parceiro</Link>
        </div>
      </header>

      <div className={styles.loginCard}>
        <h2 className={styles.title}>Acessar minha conta</h2>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">
              Usuário
            </label>
            <input 
              id="username"
              className={styles.input} 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              placeholder="Seu nome de usuário" 
              required 
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              Senha
            </label>
            <input 
              id="password"
              className={styles.input} 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <p className={styles.signupPrompt}>
            Ainda não tem uma conta?
          </p>
          
          <div className={styles.signupLinksContainer}>
            <Link to="/cadastro" className={styles.signupLink}>Criar conta de Cliente</Link>
            <Link to="/cadastro-restaurante" className={styles.signupLink}>Cadastrar meu Restaurante</Link>
          </div>
        </form>
      </div>
    </div>
  );
}