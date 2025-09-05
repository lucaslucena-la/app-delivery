import { useState } from "react"; // 1. Não precisamos mais do useEffect!
import { registerRequest } from "../services/auth";
import { useNavigate, Link } from "react-router-dom";
// 2. Importamos nosso array fixo de um arquivo de constantes
import { TIPOS_DE_CULINARIA } from "../constants/culinaria"; 

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

        <label>
          Endereço Completo
          <input value={endereco} onChange={e => setEndereco(e.target.value)} placeholder="Rua das Flores, 123, Centro" required />
        </label>

        <label>
          Telefone para Contato
          <input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 98765-4321" required />
        </label>

        {/* 4. O dropdown agora usa o array fixo para gerar as opções, sem depender de estado */}
        <label>
          Principal Tipo de Culinária
          <select value={idTipoCulinaria} onChange={e => setIdTipoCulinaria(e.target.value)} required>
            <option value="" disabled>Selecione uma opção</option>
            {TIPOS_DE_CULINARIA.map(tipo => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.descricao}
              </option>
            ))}
          </select>
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
        Já é parceiro? <Link to="/login">Faça o login aqui</Link>
      </p>
    </div>
  );
}