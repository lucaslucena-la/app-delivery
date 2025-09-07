import { useState } from "react"; // 1. Não precisamos mais do useEffect!
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
// 2. Importamos nosso array fixo de um arquivo de constantes
import { TIPOS_DE_CULINARIA } from "../constants/culinaria"; 
import styles from "./Cadastro.module.css";

export default function CadastroRestaurante() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  
  // O estado para guardar o ID selecionado continua o mesmo
  const [idTipoCulinaria, setIdTipoCulinaria] = useState(""); 

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // 3. A função de busca de dados foi removida, simplificando o componente.

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    
    try {
      // A lógica de envio continua a mesma, enviando o ID numérico
      await registerRequest({ 
        username, 
        email, 
        password, 
        is_restaurante: true,
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
    <div className={styles.pageContainer}>
      {/* NOVO: Header para consistência visual */}
      <header className={styles.header}>
        <Link to="/" className={styles.navLink}>Home</Link>
      </header>

      <div className={styles.card}>
        <h2 className={styles.title}>Cadastre seu Restaurante</h2>
        <p className={styles.subtitle}>Crie sua conta de parceiro para começar a vender.</p>
        
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="username">Nome do Restaurante (será usado no login)</label>
            <input id="username" className={styles.input} value={username} onChange={e => setUsername(e.target.value)} placeholder="restaurante_legal" required />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">E-mail de Contato</label>
            <input id="email" className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="contato@restaurante.com" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="endereco">Endereço Completo</label>
            <input id="endereco" className={styles.input} value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua das Flores, 123, Centro" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="telefone">Telefone para Contato</label>
            <input id="telefone" className={styles.input} value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 98765-4321" required />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="culinaria">Principal Tipo de Culinária</label>
            <select id="culinaria" className={styles.select} value={idTipoCulinaria} onChange={e => setIdTipoCulinaria(e.target.value)} required>
              <option value="" disabled>Selecione uma opção</option>
              {TIPOS_DE_CULINARIA.map(tipo => (
                <option key={tipo.id} value={tipo.id}>{tipo.descricao}</option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">Senha de Acesso</label>
            <input id="password" className={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>

          <button type="submit" className={styles.button}>Criar Conta de Parceiro</button>

          {msg && <p className={`${styles.feedbackMessage} ${styles.success}`}>{msg}</p>}
          {err && <p className={`${styles.feedbackMessage} ${styles.error}`}>{err}</p>}
        </form>

        <p className={styles.loginPrompt}>
          Já é parceiro? <Link to="/login" className={styles.loginLink}>Faça o login aqui</Link>
        </p>
      </div>
    </div>
  );
}