import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { catalogoRestaurante } from "../services/restaurante";
import type { Prato } from "../services/restaurante";           // <- tipo
import { criarPedido, pagarPedido } from "../services/pedido";
import { getUser } from "../store/auth";

export default function Catalogo() {
  const { id } = useParams(); // id do restaurante
  const navigate = useNavigate();
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [quantidades, setQuantidades] = useState<Record<number, number>>({});
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    catalogoRestaurante(Number(id)).then(setPratos).catch(e => {
      setErr(e?.response?.data?.message || "Erro ao carregar catálogo");
    });
  }, [id]);

  function alterarQtd(id_prato: number, delta: number) {
    setQuantidades(q => {
      const nova = { ...q, [id_prato]: Math.max(0, (q[id_prato] || 0) + delta) };
      return nova;
    });
  }

  async function fazerPedido() {
    setMsg(null); setErr(null);
    const user = getUser();
    if (!user) {
      setErr("Faça login primeiro.");
      navigate("/login");
      return;
    }
    const itens = Object.entries(quantidades)
      .filter(([_, qtd]) => qtd > 0)
      .map(([id_prato, quantidade_item]) => ({ id_prato: Number(id_prato), quantidade_item: Number(quantidade_item) }));

    if (!itens.length) {
      setErr("Selecione ao menos 1 item.");
      return;
    }

    try {
      // cria pedido
      const created = await criarPedido({
        id_cliente: user.id,
        id_restaurante: Number(id),
        forma_pagamento: "pix", // você pode deixar escolhível
        items: itens,
      });
      const pedido = created.pedido;
      // paga pedido (simples, para fechar fluxo)
      await pagarPedido({ id_pedido: pedido.id_pedido, forma_pagamento: "pix" });
      setMsg(`Pedido #${pedido.id_pedido} criado e pago!`);
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Erro ao criar/pagar pedido");
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 16 }}>
      <h2>Catálogo</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {pratos.map(p => (
        <div key={p.id_prato} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginBottom: 8 }}>
          <strong>{p.nome}</strong>
          <div>{p.descricao}</div>
          <div>Preço: R$ {(p.valor / 100).toFixed(2)}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <button onClick={() => alterarQtd(p.id_prato, -1)}>-</button>
            <span>{quantidades[p.id_prato] || 0}</span>
            <button onClick={() => alterarQtd(p.id_prato, +1)}>+</button>
          </div>
        </div>
      ))}

      {pratos.length > 0 && (
        <button onClick={fazerPedido} style={{ marginTop: 16 }}>
          Fazer pedido (PIX)
        </button>
      )}
    </div>
  );
}
