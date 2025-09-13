import React, { useState, useEffect } from 'react';
import { getUser } from '../../store/auth.ts';
// import { getPedidosRestaurante, updateStatusPedido } from '../../services/pedido'; // Funções que criaremos
import styles from './GerenciarPedidos.module.css';

// --- Tipos de Dados (Exemplo) ---
// Estes tipos devem espelhar a resposta da sua nova API
interface ItemPedido {
  nome_prato: string;
  quantidade_item: number;
  infos_adicionais: string;
}

interface Pedido {
  id_pedido: number;
  nome_cliente: string;
  data_pedido: string;
  status: string;
  valor: number;
  itens: ItemPedido[];
}

// --- Dados de Exemplo (Enquanto a API não existe) ---
const mockPedidos: Pedido[] = [
  {
    id_pedido: 8,
    nome_cliente: 'Ana Beatriz',
    data_pedido: '2025-09-12T21:48:15.792Z',
    status: 'pedido_esperando_ser_aceito',
    valor: 5500,
    itens: [
      { nome_prato: 'Pizza Pepperoni', quantidade_item: 1, infos_adicionais: 'Borda recheada com cheddar' },
      { nome_prato: 'Refrigerante 2L', quantidade_item: 1, infos_adicionais: '' },
    ],
  },
  {
    id_pedido: 7,
    nome_cliente: 'Carlos Silva',
    data_pedido: '2025-09-12T20:30:00.000Z',
    status: 'em_preparo',
    valor: 4000,
    itens: [{ nome_prato: 'Pizza Margherita', quantidade_item: 1, infos_adicionais: 'Sem orégano' }],
  },
];

// Componente principal
export function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
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
        // --- LÓGICA FICTÍCIA ---
        // Quando a rota existir,  faremos a chamada aqui:
        // const data = await getPedidosRestaurante(user.id_restaurante);
        // setPedidos(data);
        setTimeout(() => {
          setPedidos(mockPedidos);
          setIsLoading(false);
        }, 1000); // Simula carregamento
      } catch (err: any) {
        setError(err.message || "Falha ao buscar pedidos.");
        setIsLoading(false);
      }
    };

    carregarPedidos();
  }, []);

  const handleUpdateStatus = async (id_pedido: number, novoStatus: string) => {
    console.log(`Simulando atualização do pedido ${id_pedido} para o status: ${novoStatus}`);
    // Lógica da API: await updateStatusPedido(id_pedido, novoStatus);
    
    // Atualiza o estado local para refletir a mudança instantaneamente
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
                    {pedido.itens.map((item, index) => (
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

