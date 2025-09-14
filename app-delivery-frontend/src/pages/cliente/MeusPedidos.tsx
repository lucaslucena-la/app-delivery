import React, { useState, useEffect } from 'react';
import { getUser } from '../../store/auth.ts';
import { getPedidosCliente, type PedidoClienteResponse } from '../../services/pedido.ts';
import styles from './MeusPedidos.module.css';

// Componente principal
export function MeusPedidos() {
  const [pedidos, setPedidos] = useState<PedidoClienteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);

  useEffect(() => {
    const user = getUser();
    if (!user || typeof user.id_cliente !== 'number') {
      setError("Cliente não identificado. Por favor, faça o login.");
      setIsLoading(false);
      return;
    }

    const carregarPedidos = async () => {
      try {
        const data = await getPedidosCliente(user.id_cliente as number);
        setPedidos(data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Falha ao buscar seus pedidos.");
      } finally {
        // Apenas para o carregamento inicial
        if (isLoading) setIsLoading(false);
      }
    };

    // 1. Carrega os pedidos imediatamente
    carregarPedidos();

    // 2. Inicia o "polling": verifica por atualizações a cada 15 segundos
    const intervalId = setInterval(carregarPedidos, 15000);

    // 3. Limpa o intervalo quando o componente é desmontado para evitar vazamentos de memória
    return () => clearInterval(intervalId);
  }, []); // O array vazio garante que o setup rode apenas uma vez

  const toggleDetalhes = (id_pedido: number) => {
    setPedidoExpandido(pedidoExpandido === id_pedido ? null : id_pedido);
  };

  if (isLoading) return <p className={styles.loading}>Carregando seus pedidos...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meus Pedidos</h1>
      
      <div className={styles.pedidosList}>
        {pedidos.length === 0 ? (
          <p>Você ainda não fez nenhum pedido.</p>
        ) : (
          pedidos.map(pedido => (
            <div key={pedido.id_pedido} className={styles.pedidoCard}>
              <div className={styles.pedidoHeader}>
                <div>
                  <strong>{pedido.nome_restaurante}</strong>
                  <p>Pedido #{pedido.id_pedido}</p>
                  <p>Data: {new Date(pedido.data_pedido).toLocaleString('pt-BR')}</p>
                </div>
                <div className={styles.pedidoValorStatus}>
                  <span>Total: {(pedido.valor / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  <span className={`${styles.statusBadge} ${styles[pedido.status]}`}>
                    {pedido.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              <div className={styles.pedidoActions}>
                <button onClick={() => toggleDetalhes(pedido.id_pedido)} className={styles.detailsButton}>
                  {pedidoExpandido === pedido.id_pedido ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                </button>
              </div>

              {pedidoExpandido === pedido.id_pedido && (
                <div className={styles.pedidoDetalhes}>
                  <h4>Itens do Pedido:</h4>
                  <ul>
                    {pedido.items.map((item, index) => (
                      <li key={index}>
                        <p><strong>{item.quantidade_item}x {item.nome_prato}</strong></p>
                        {item.infos_adicionais && <p className={styles.observacao}>Obs: {item.infos_adicionais}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
