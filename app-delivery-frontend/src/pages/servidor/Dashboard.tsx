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

// Dados de exemplo que virão da sua API no futuro
const mockData = {
  contagemPedidos: {
    aguardando: 5,
    em_preparo: 8,
    a_caminho: 3,
  },
  metricasHoje: {
    faturamento: 157050, // Em centavos
    totalPedidos: 25,
  },
  estoqueBaixo: [
    { id_prato: 12, nome: 'Cheesecake de Morango', estoque: 4 },
    { id_prato: 5, nome: 'Suco de Laranja', estoque: 8 },
  ],
  ultimasAvaliacoes: [
    { nome_cliente: 'Maria S.', nota: 5, comentario: 'Excelente! Chegou rápido e quente.' },
    { nome_cliente: 'João P.', nota: 4, comentario: 'Muito bom, mas a embalagem amassou.' },
  ],
};

// Componente para renderizar estrelas de avaliação
const StarRating = ({ rating }: { rating: number }) => (
  <div className={styles.starRating}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={16} color={i < rating ? '#ffc107' : '#e0e0e0'} fill={i < rating ? '#ffc107' : 'none'} />
    ))}
  </div>
);

export default function Dashboard() {
  const [data, setData] = useState<typeof mockData | null>(null);

  useEffect(() => {
    // Simula o carregamento dos dados
    setTimeout(() => {
      setData(mockData);
    }, 500);
  }, []);

  if (!data) {
    return <div className={styles.loading}>Carregando...</div>;
  }
  
  const ticketMedio = data.metricasHoje.totalPedidos > 0 ? data.metricasHoje.faturamento / data.metricasHoje.totalPedidos : 0;

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Visão Geral</h1>
        <p>Segunda, 15 de Setembro de 2025</p>
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
          <ul>
            {data.estoqueBaixo.map(item => (
              <li key={item.id_prato}>
                <Link to="/painel/cardapio">{item.nome}</Link>
                <span>{item.estoque} un.</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.listCard}>
          <h3 className={styles.listCardTitle}><Star size={20} /> Últimas Avaliações</h3>
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
        </div>
      </div>
    </div>
  );
}


//Rotas necessárias para atender a esta página:

/*Rota GET /restaurante/:id/dashboard para buscar todos os dados do dashboard de uma só vez.

Dados necessários:

Contagem de pedidos por status (aguardando, em preparo, a caminho).

Métricas do dia (faturamento, total de pedidos).

Lista de itens com estoque baixo (nome do prato, quantidade em estoque).

Últimas avaliações recebidas (nome do cliente, nota, comentário).

*/


