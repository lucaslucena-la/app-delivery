import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../context/CarrinhoContext';
import { criarPedido} from '../../services/pedido';
import { getUser } from '../../store/auth';

type FormaDePagamento = "pix" | "em_especie" | "credito" | "debito";

const formasPagamentoLabels: { [key in FormaDePagamento]: string } = {
  pix: 'PIX',
  em_especie: 'Dinheiro',
  credito: 'Cartão de Crédito',
  debito: 'Cartão de Débito',
};

export default function Carrinho() {
  const navigate = useNavigate();
  const { items, total, updateQuantity, updateObservacao, removeFromCart, clearCart } = useCarrinho();
  
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaDePagamento | ''>('');

  async function fazerPedido() {

     // --- ADICIONE ESTAS DUAS LINHAS PARA DIAGNÓSTICO ---
    console.log("Iniciando a finalização do pedido. Verificando usuário...");
    const user = getUser();
    console.log("Dados do usuário que o carrinho está vendo:", user);
    setMsg(null); setErr(null);


    if (!user || typeof user.id_cliente !== 'number') {
      setErr("Erro: Usuário cliente não identificado. Por favor, faça o login novamente.");
      navigate("/login");
      return;
    }

    if (!formaPagamento) {
      setErr("Por favor, selecione uma forma de pagamento.");
      return;
    }

    if (items.length === 0) {
      setErr("Seu carrinho está vazio.");
      return;
    }

    const id_restaurante = items[0].prato.id_restaurante;

    const itensParaApi = items.map(item => ({
      id_prato: item.prato.id_prato,
      quantidade_item: item.quantidade,
      infos_adicionais: item.observacao,
    }));

    try {
      const created = await criarPedido({
        id_cliente: user.id_cliente,
        id_restaurante,
        forma_pagamento: formaPagamento,
        items: itensParaApi,
      });
      
      const pedido = created.pedido;
      
      console.log(`LOG: Pedido #${pedido.id_pedido} enviado para o restaurante.`);
      setMsg(`Pedido #${pedido.id_pedido} enviado com sucesso! Agora é só aguardar a confirmação do restaurante.`);
      clearCart();
      
    } catch (e: any) {
      console.error("LOG: Falha ao finalizar o pedido.", e);
      setErr(e?.response?.data?.message || "Erro ao criar/pagar pedido");
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto", padding: 16 }}>
      <h2>Meu Carrinho</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      {msg && <p style={{ color: "green" }}>{msg}</p>}

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.prato.id_prato} style={{ borderBottom: "1px solid #eee", padding: "12px 0" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{item.prato.nome}</strong>
                  <div>R$ {(item.prato.valor / 100).toFixed(2)}</div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                    <button onClick={() => updateQuantity(item.prato.id_prato, item.quantidade - 1)}>-</button>
                    <span>{item.quantidade}</span>
                    <button onClick={() => updateQuantity(item.prato.id_prato, item.quantidade + 1)}>+</button>
                    <button onClick={() => removeFromCart(item.prato.id_prato)} style={{ marginLeft: 16, color: 'crimson', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Remover</button>
                  </div>
                </div>
                <div>
                  <strong>Subtotal: R$ {((item.prato.valor * item.quantidade) / 100).toFixed(2)}</strong>
                </div>
              </div>
              <input
                type="text"
                value={item.observacao || ''}
                onChange={(e) => updateObservacao(item.prato.id_prato, e.target.value)}
                placeholder="Adicionar observação (ex: sem cebola)"
                style={{ width: '100%', marginTop: '10px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              />
            </div>
          ))}
          
          <div style={{ marginTop: '2rem' }}>
            <h4>Forma de Pagamento</h4>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as FormaDePagamento)}
              style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="" disabled>Selecione uma opção...</option>
              {(Object.keys(formasPagamentoLabels) as Array<keyof typeof formasPagamentoLabels>).map((key) => (
                <option key={key} value={key}>
                  {formasPagamentoLabels[key]}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ marginTop: '2rem', textAlign: 'right' }}>
            <h3>Total: R$ {(total / 100).toFixed(2)}</h3>
            <button onClick={fazerPedido} style={{ marginTop: 8, padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }}>
              Finalizar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}

