import { useState } from "react";
import { registerRequest } from "../services/auth.ts";
import { useNavigate, Link } from "react-router-dom";
import styles from "./CadastroCliente.module.css"; // Usaremos um CSS dedicado

export default function CadastroCliente() {
  // Sua lógica de estados permanece a mesma
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  // Sua função de envio permanece a mesma
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await registerRequest({ 
        nome_completo: nomeCompleto,
        cpf,
        telefone,
        username, 
        email, 
        password, 
        is_restaurante: false 
      });
      setMsg("Cadastro realizado! Você será redirecionado para o login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div className={styles.pageLayout}>
      {/* Painel da Imagem (Esquerda) */}

      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            FlashFood
          </Link>
        </div>
      </header>


      <div className={styles.imagePanel}>
        <div className={styles.imageOverlay}>
          <h2>Sua próxima refeição favorita está a um clique de distância.</h2>
          <p>Cadastre-se e explore os melhores sabores da sua cidade.</p>
        </div>
      </div>

      {/* Painel do Formulário (Direita) */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Crie sua Conta</h2>
          <p className={styles.subtitle}>É rápido, fácil e delicioso.</p>
          
          <form onSubmit={onSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="nomeCompleto">Nome Completo</label>
              <input id="nomeCompleto" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cpf">CPF</label>
              <input id="cpf" value={cpf} onChange={e => setCpf(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input id="telefone" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>
            <hr className={styles.divider} />
            <div className={styles.formGroup}>
              <label htmlFor="username">Nome de Usuário</label>
              <input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Senha</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>

            {err && <p className={styles.error}>{err}</p>}
            {msg && <p className={styles.success}>{msg}</p>}

            <button type="submit" className={styles.button}>Cadastrar</button>
          </form>
          <p className={styles.loginPrompt}>
            Já tem conta? <Link to="/login" className={styles.loginLink}>Fazer login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

