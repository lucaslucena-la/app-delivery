import { useEffect, useState } from "react";
import { criarRestaurante, meuRestaurante } from "../services/restaurante";
import { getUser } from "../store/auth";
import { useNavigate } from "react-router-dom";

export default function CriarRestaurante() {
  const user = getUser();
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      nav("/login");
      return;
    }
    // se já tiver restaurante, manda pra home/restaurantes
    (async () => {
      try {
        await meuRestaurante();
        setMsg("Você já possui restaurante cadastrado.");
        setTimeout(() => nav("/"), 800);
      } catch {
        // não tem restaurante ainda → ok seguir
      }
    })();
  }, [user, nav]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    try {
      await criarRestaurante({ nome, email, endereco, telefone });
      setMsg("Restaurante criado com sucesso!");
      setTimeout(() => nav("/restaurantes"), 800);
    } catch (e: any) {
      setErr(e?.response?.data?.message ?? "Erro ao criar restaurante");
    }
  }

  if (!user) return null;

  return (
    <div style={{ maxWidth: 520, margin: "3rem auto", padding: 24, border: "1px solid #eee", borderRadius: 12 }}>
      <h2>Cadastrar meu restaurante</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label>
          Nome do restaurante
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Minha Lanchonete" />
        </label>
        <label>
          E-mail
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="contato@meurestaurante.com" />
        </label>
        <label>
          Endereço
          <input value={endereco} onChange={e=>setEndereco(e.target.value)} placeholder="Rua X, 123" />
        </label>
        <label>
          Telefone
          <input value={telefone} onChange={e=>setTelefone(e.target.value)} placeholder="11999999999" />
        </label>
        <button type="submit">Criar restaurante</button>
      </form>
      {msg && <p style={{ color: "green", marginTop: 10 }}>{msg}</p>}
      {err && <p style={{ color: "crimson", marginTop: 10 }}>{err}</p>}
    </div>
  );
}
