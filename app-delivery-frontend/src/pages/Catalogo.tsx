import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { catalogoRestaurante } from "../services/restaurante";
import type { Prato } from "../services/restaurante";
import { useCarrinho } from "../context/CarrinhoContext"; // <- Importa o hook do carrinho

export default function Catalogo() {
  const { id } = useParams(); // id do restaurante
  const { addToCart } = useCarrinho(); // <- Pega a função de adicionar ao carrinho
  
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    catalogoRestaurante(Number(id)).then(setPratos).catch(e => {
      setErr(e?.response?.data?.message || "Erro ao carregar catálogo");
    });
  }, [id]);

  function handleAddToCart(prato: Prato) {
    addToCart(prato);
    setFeedback(`${prato.nome} adicionado ao carrinho!`);
    // Limpa a mensagem depois de alguns segundos
    setTimeout(() => setFeedback(null), 2000);
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 16 }}>
      <h2>Catálogo</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {feedback && <p style={{ color: "green" }}>{feedback}</p>}

      {pratos.map(p => (
        <div key={p.id_prato} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginBottom: 8 }}>
          <strong>{p.nome}</strong>
          <div>{p.descricao}</div>
          <div>Preço: R$ {(p.valor / 100).toFixed(2)}</div>
          <div style={{ marginTop: 8 }}>
            <button onClick={() => handleAddToCart(p)}>Adicionar ao Carrinho</button>
          </div>
        </div>
      ))}
    </div>
  );
}