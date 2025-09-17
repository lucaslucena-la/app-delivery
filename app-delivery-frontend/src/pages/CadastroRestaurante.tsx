import { useState } from "react";
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
import { TIPOS_DE_CULINARIA } from "../constants/culinaria"; 
import styles from "./CadastroRestaurante.module.css"; // Usa o novo CSS

export default function CadastroRestaurante() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idTipoCulinaria, setIdTipoCulinaria] = useState(""); 
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await registerRequest({ 
        username, 
        email, 
        password, 
        is_restaurante: true,
        nome: username, 
        endereco,
        telefone,
        id_tipo_culinaria: parseInt(idTipoCulinaria, 10)
      });
      setMsg("Cadastro realizado! Você será levado ao login.");
      setTimeout(() => navigate("/login"), 1500); 
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro no cadastro");
    }
  }

  return (
    <div className={styles.pageLayout}>

      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            FlashFood
          </Link>
        </div>
      </header>

      {/* Painel da Imagem (Esquerda) */}
      <div className={styles.imagePanel}>
        <div className={styles.imageOverlay}>
          <h2>Junte-se à nossa rede de parceiros</h2>
          <p>Leve seus pratos a milhares de novos clientes.</p>
        </div>
      </div>

      {/* Painel do Formulário (Direita) */}
      <div className={styles.formPanel}>
        <div className={styles.formContainer}>
          <h2 className={styles.title}>Cadastre seu Restaurante</h2>
          <p className={styles.subtitle}>Crie sua conta de parceiro para começar a vender.</p>
          
          <form onSubmit={onSubmit}>
            <div className={styles.formGroup}>
              <label>Nome do Restaurante (será usado no login)</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>E-mail de Contato</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
             <div className={styles.formGroup}>
              <label>Senha</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Endereço Completo</label>
              <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Telefone</label>
              <input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} required />
            </div>
            <div className={styles.formGroup}>
              <label>Principal Tipo de Culinária</label>
              <select value={idTipoCulinaria} onChange={e => setIdTipoCulinaria(e.target.value)} required>
                <option value="" disabled>Selecione uma opção</option>
                {TIPOS_DE_CULINARIA.map(tipo => (
                  <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>
                ))}
              </select>
            </div>

            {err && <p className={styles.error}>{err}</p>}

            <button type="submit" className={styles.button}>Criar Conta de Parceiro</button>
          </form>

          <p className={styles.loginPrompt}>
            Já é parceiro? <Link to="/login" className={styles.loginLink}>Faça o login aqui</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

