import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCarrinho } from '../../context/CarrinhoContext';
import { criarPedido } from '../../services/pedido';
import { getUser } from '../../store/auth';
import styles from './Carrinho.module.css'; // Import the CSS module

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
    console.log("Iniciando a finalização do pedido. Verificando usuário...");
    const user = getUser();
    console.log("Dados do usuário que o carrinho está vendo:", user);
    setMsg(null);
    setErr(null);

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
    <div className={styles.container}>
      <h2 className={styles.title}>Meu Carrinho</h2>
      {err && <p className={styles.error}>{err}</p>}
      {msg && <p className={styles.success}>{msg}</p>}

      {items.length === 0 ? (
        <p className={styles.emptyMessage}>Seu carrinho está vazio.</p>
      ) : (
        <>
          <div className={styles.itemsContainer}>
            {items.map(item => (
              <div key={item.prato.id_prato} className={styles.item}>
                <div className={styles.itemDetails}>
                  <div className={styles.itemInfo}>
                    <strong className={styles.itemName}>{item.prato.nome}</strong>
                    
                    <div className={styles.itemPrice}>R$ {(item.prato.valor / 100).toFixed(2)}</div>
                    
                    <div className={styles.quantityControls}>
                      
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.prato.id_prato, item.quantidade - 1)}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>{item.quantidade}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateQuantity(item.prato.id_prato, item.quantidade + 1)}
                      >
                        +
                      </button>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item.prato.id_prato)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                  <div className={styles.itemSubtotal}>
                    <strong>Subtotal: R$ {((item.prato.valor * item.quantidade) / 100).toFixed(2)}</strong>
                  </div>
                </div>
                <input
                  type="text"
                  value={item.observacao || ''}
                  onChange={(e) => updateObservacao(item.prato.id_prato, e.target.value)}
                  placeholder="Adicionar observação (ex: sem cebola)"
                  className={styles.observationInput}
                />
              </div>
            ))}
          </div>
          
          <div className={styles.paymentSection}>
            <h4 className={styles.sectionTitle}>Forma de Pagamento</h4>
            <select
              value={formaPagamento}
              onChange={(e) => setFormaPagamento(e.target.value as FormaDePagamento)}
              className={styles.paymentSelect}
            >
              <option value="" disabled>Selecione uma opção...</option>
              {(Object.keys(formasPagamentoLabels) as Array<keyof typeof formasPagamentoLabels>).map((key) => (
                <option key={key} value={key}>
                  {formasPagamentoLabels[key]}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.summarySection}>
            <h3 className={styles.total}>Total: R$ {(total / 100).toFixed(2)}</h3>
            <button onClick={fazerPedido} className={styles.checkoutButton}>
              Finalizar Pedido
            </button>
          </div>
        </>
      )}
    </div>
  );
}