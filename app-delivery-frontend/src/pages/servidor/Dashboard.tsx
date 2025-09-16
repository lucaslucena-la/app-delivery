import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';
import {
  Package,
  CookingPot,
  Bike,
  DollarSign,
  ClipboardCheck,
  BarChart2,
  AlertTriangle,
  Star,
} from 'lucide-react';
import { getUser } from '../../store/auth';
// --- 1. Importa a nova função de serviço e o tipo ---
import { getDashboardData, type DashboardData } from '../../services/restaurante';


// Componente para renderizar estrelas de avaliação (mantido)
const StarRating = ({ rating }: { rating: number }) => (
  <div className={styles.starRating}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} color={i < rating ? '#ffc107' : '#e0e0e0'} fill={i < rating ? '#ffc107' : 'none'} />
    ))}
  </div>
);

export default function Dashboard() {
  // --- 2. O estado agora usa o novo tipo ---
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // --- 3. A lógica de carregamento agora chama a API ---
    const carregarDashboard = async () => {
      const user = getUser();
      if (!user?.id_restaurante) {
        setError("Usuário de restaurante não identificado.");
        setIsLoading(false);
        return;
      }

      try {
        const dashboardData = await getDashboardData(user.id_restaurante);
        setData(dashboardData);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Não foi possível carregar os dados do painel.");
      } finally {
        setIsLoading(false);
      }
    };

    carregarDashboard();
  }, []); // Roda apenas uma vez ao carregar

  if (isLoading) {
    return <div className={styles.loading}>Carregando painel...</div>;
  }
  
  if (error) {
    return <div className={styles.loading}>{error}</div>;
  }

  if (!data) {
    return <div className={styles.loading}>Nenhum dado para exibir.</div>;
  }
  
  const ticketMedio = data.metricasHoje.totalPedidos > 0 ? data.metricasHoje.faturamento / data.metricasHoje.totalPedidos : 0;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Visão Geral</h1>
        {/* Data pode ser dinâmica no futuro */}
        <p>{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </header>

      {/* Seção 1: Visão Geral dos Pedidos */}
      <div className={styles.grid}>
        <Link to="/painel/pedidos" className={`${styles.card} ${styles.highlightCard}`}>
          <div className={styles.cardIcon}><Package /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{data.contagemPedidos.aguardando}</span>
            <span className={styles.cardTitle}>Aguardando Confirmação</span>
          </div>
        </Link>
        <div className={styles.card}>
          <div className={styles.cardIcon}><CookingPot /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{data.contagemPedidos.em_preparo}</span>
            <span className={styles.cardTitle}>Em Preparo</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><Bike /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{data.contagemPedidos.a_caminho}</span>
            <span className={styles.cardTitle}>Aguardando Entrega</span>
          </div>
        </div>
      </div>

      {/* Seção 2: Métricas Financeiras */}
      <h2 className={styles.sectionTitle}>Desempenho de Hoje</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}><DollarSign /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>
              {(data.metricasHoje.faturamento / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className={styles.cardTitle}>Faturamento (Hoje)</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><ClipboardCheck /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>{data.metricasHoje.totalPedidos}</span>
            <span className={styles.cardTitle}>Pedidos Concluídos (Hoje)</span>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardIcon}><BarChart2 /></div>
          <div className={styles.cardContent}>
            <span className={styles.cardValue}>
              {(ticketMedio / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
            <span className={styles.cardTitle}>Ticket Médio (Hoje)</span>
          </div>
        </div>
      </div>
      
      {/* Seção 3: Avisos e Informações Rápidas */}
      <h2 className={styles.sectionTitle}>Avisos e Informações</h2>
      <div className={styles.gridTwoCols}>
        <div className={styles.listCard}>
          <h3 className={styles.listCardTitle}><AlertTriangle size={20} /> Atenção ao Estoque</h3>
          {data.estoqueBaixo.length > 0 ? (
            <ul>
              {data.estoqueBaixo.map(item => (
                <li key={item.id_prato}>
                  <Link to="/painel/cardapio">{item.nome}</Link>
                  <span>{item.estoque} un.</span>
                </li>
              ))}
            </ul>
          ) : <p>Nenhum item com estoque baixo.</p>}
        </div>
        <div className={styles.listCard}>
          <h3 className={styles.listCardTitle}><Star size={20} /> Últimas Avaliações</h3>
          {data.ultimasAvaliacoes.length > 0 ? (
            <ul>
              {data.ultimasAvaliacoes.map((avaliacao, index) => (
                <li key={index} className={styles.avaliacaoItem}>
                  <div>
                    <strong>{avaliacao.nome_cliente}</strong>
                    <p>"{avaliacao.comentario}"</p>
                  </div>
                  <StarRating rating={avaliacao.nota} />
                </li>
              ))}
            </ul>
          ) : <p>Nenhuma avaliação recente.</p>}
        </div>
      </div>
    </div>
  );
}

