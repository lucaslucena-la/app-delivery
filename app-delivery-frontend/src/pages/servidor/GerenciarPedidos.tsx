import React, { useState, useEffect } from 'react';
import { getUser } from '../../store/auth.ts';
import { getPedidosRestaurante, type PedidoResponse } from '../../services/restaurante.ts';
// import { updateStatusPedido } from '../../services/pedido';
import styles from './GerenciarPedidos.module.css';

// Componente principal
export function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState<PedidoResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);

  useEffect(() => {
    const carregarPedidos = async () => {
      const user = getUser();
      if (!user?.id_restaurante) {
        setError("Usuário de restaurante não identificado.");
        setIsLoading(false);
        return;
      }
      try {
        const data = await getPedidosRestaurante(user.id_restaurante);
        // A ordenação agora pode vir direto do banco, mas manter aqui não prejudica
        const pedidosOrdenados = data.sort((a, b) => b.id_pedido - a.id_pedido);
        setPedidos(pedidosOrdenados);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Falha ao buscar pedidos.");
      } finally {
        setIsLoading(false);
      }
    };
    carregarPedidos();
  }, []);

  const handleUpdateStatus = async (id_pedido: number, novoStatus: string) => {
    console.log(`(Simulação) Atualizando pedido ${id_pedido} para status: ${novoStatus}`);
    // Futuramente, a chamada real da API virá aqui:
    // await updateStatusPedido(id_pedido, novoStatus);
    setPedidos(pedidosAtuais =>
        pedidosAtuais.map(p => (p.id_pedido === id_pedido ? { ...p, status: novoStatus } : p))
    );
  };

  const toggleDetalhes = (id_pedido: number) => {
    setPedidoExpandido(pedidoExpandido === id_pedido ? null : id_pedido);
  };

  if (isLoading) return <p>Carregando pedidos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gerenciar Pedidos</h1>
      
      <div className={styles.pedidosList}>
        {pedidos.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          pedidos.map(pedido => (
            <div key={pedido.id_pedido} className={styles.pedidoCard}>
              <div className={styles.pedidoHeader}>
                <div>
                  <strong>Pedido #{pedido.id_pedido}</strong>
                  <p>Cliente: {pedido.nome_cliente}</p>
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
                <select 
                  className={styles.statusSelect}
                  value={pedido.status}
                  onChange={(e) => handleUpdateStatus(pedido.id_pedido, e.target.value)}
                >
                  <option value="pedido_esperando_ser_aceito">Pendente</option>
                  <option value="em_preparo">Em Preparo</option>
                  <option value="saiu_para_entrega">Saiu para Entrega</option>
                </select>
                <button onClick={() => toggleDetalhes(pedido.id_pedido)} className={styles.detailsButton}>
                  {pedidoExpandido === pedido.id_pedido ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                </button>
              </div>

              {pedidoExpandido === pedido.id_pedido && (
                <div className={styles.pedidoDetalhes}>
                  <h4>Itens do Pedido:</h4>
                  <ul>
                    {pedido.items.map((item) => (
                      <li key={item.id_item_pedido}>
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

