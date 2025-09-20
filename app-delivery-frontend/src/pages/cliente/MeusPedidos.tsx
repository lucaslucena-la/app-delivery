import React, { useState, useEffect } from 'react';
import { getUser } from '../../store/auth';
import { getPedidosCliente, type PedidoClienteResponse } from '../../services/pedido';
import { submitAvaliacao, type AvaliacaoPayload } from '../../services/avaliacoes';
import styles from './MeusPedidos.module.css';
import { Star } from 'lucide-react';

// --- COMPONENTE DO MODAL DE AVALIAÇÃO ---
interface ModalAvaliacaoProps {
  pedido: PedidoClienteResponse;
  onClose: () => void;
  onSave: () => void;
}

function ModalAvaliacao({ pedido, onClose, onSave }: ModalAvaliacaoProps) {
  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentarios, setComentarios] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const user = getUser();
    if (nota === 0) {
      setError("Por favor, selecione uma nota.");
      return;
    }
    if (!user?.id_cliente) return;

    const payload: AvaliacaoPayload = {
      id_pedido: pedido.id_pedido,
      id_cliente: user.id_cliente,
      id_restaurante: pedido.id_restaurante,
      nota,
      comentarios
    };

    try {
      await submitAvaliacao(payload);
      onSave();
    } catch (err: any) {
      setError(err?.response?.data?.message || "Não foi possível enviar sua avaliação.");
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Avalie seu Pedido</h2>
        <p>Restaurante: <strong>{pedido.nome_restaurante}</strong></p>
        <div className={styles.starRating}>
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <Star
                key={ratingValue}
                size={32}
                onMouseEnter={() => setHoverNota(ratingValue)}
                onMouseLeave={() => setHoverNota(0)}
                onClick={() => setNota(ratingValue)}
                color={ratingValue <= (hoverNota || nota) ? "#ffc107" : "#e4e5e9"}
                fill={ratingValue <= (hoverNota || nota) ? "#ffc107" : "none"}
                style={{ cursor: 'pointer', transition: 'color 0.2s' }}
              />
            );
          })}
        </div>
        <textarea
          className={styles.textArea}
          value={comentarios}
          onChange={(e) => setComentarios(e.target.value)}
          placeholder="Deixe um comentário (opcional)..."
        />
        {error && <p className={styles.errorMessageModal}>{error}</p>}
        <div className={styles.modalActions}>
          <button onClick={onClose} className={styles.cancelButton}>Cancelar</button>
          <button onClick={handleSubmit} className={styles.submitButton}>Enviar Avaliação</button>
        </div>
      </div>
    </div>
  );
}


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export function MeusPedidos() {
  const [pedidos, setPedidos] = useState<PedidoClienteResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pedidoExpandido, setPedidoExpandido] = useState<number | null>(null);
  const [pedidoParaAvaliar, setPedidoParaAvaliar] = useState<PedidoClienteResponse | null>(null);

  const fetchPedidos = async () => {
    const user = getUser();
    if (!user?.id_cliente) {
      setError("Cliente não identificado.");
      setIsLoading(false);
      return;
    }
    try {
      const data = await getPedidosCliente(user.id_cliente);
      setPedidos(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Falha ao buscar seus pedidos.");
    } finally {
      if(isLoading) setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchPedidos(); // Carga inicial
    const intervalId = setInterval(fetchPedidos, 15000); // Polling
    return () => clearInterval(intervalId);
  }, []);

  const handleSaveAvaliacao = () => {
    setPedidoParaAvaliar(null);
    fetchPedidos(); // Recarrega os pedidos para atualizar o status do botão "Avaliar"
  };

  const toggleDetalhes = (id_pedido: number) => {
    setPedidoExpandido(pedidoExpandido === id_pedido ? null : id_pedido);
  };
  
  if (isLoading) return <p className={styles.loading}>Carregando...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.container}>
      {pedidoParaAvaliar && 
        <ModalAvaliacao 
          pedido={pedidoParaAvaliar} 
          onClose={() => setPedidoParaAvaliar(null)}
          onSave={handleSaveAvaliacao}
        />
      }
      <h1 className={styles.title}>Meus Pedidos</h1>
      <div className={styles.pedidosList}>
        {pedidos.map(pedido => (
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
              {pedido.status === 'completo' && !pedido.foi_avaliado && (
                <button className={styles.avaliarButton} onClick={() => setPedidoParaAvaliar(pedido)}>Avaliar Pedido</button>
              )}
              {pedido.status === 'completo' && pedido.foi_avaliado && (
                <span className={styles.avaliadoLabel}>Avaliado</span>
              )}
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
        ))}
      </div>
    </div>
  );
}

