import React from 'react';
import type { Horario } from '../services/restaurante';
import styles from './StatusFuncionamento.module.css';

interface Props {
  horarios: Horario[];
}

// Mapeia o getDay() do JavaScript para os nomes dos dias em português
const diasDaSemana = [
  'domingo', 
  'segunda-feira', 
  'terça-feira', 
  'quarta-feira', 
  'quinta-feira', 
  'sexta-feira', 
  'sábado'
];

export default function StatusFuncionamento({ horarios }: Props) {
  const agora = new Date();
  const diaAtualStr = diasDaSemana[agora.getDay()];
  const diaAnteriorStr = diasDaSemana[(agora.getDay() - 1 + 7) % 7];

  let estaAberto = false;

  // --- FUNÇÃO AUXILIAR PARA CRIAR DATAS DE COMPARAÇÃO ---
  const criarDataComHoraDeHoje = (dataStringDoBanco: string) => {
    const horaDoBanco = new Date(dataStringDoBanco).toTimeString().split(' ')[0]; // Extrai "HH:mm:ss"
    const dataDeHoje = agora.toISOString().split('T')[0];
    return new Date(`${dataDeHoje}T${horaDoBanco}`);
  };
  
  // 1. VERIFICA O HORÁRIO DE HOJE
  const horarioHoje = horarios.find(h => h.dia_da_semana.toLowerCase() === diaAtualStr);
  if (horarioHoje) {
    const aberturaHoje = criarDataComHoraDeHoje(horarioHoje.hora_abertura);
    const fechamentoHoje = criarDataComHoraDeHoje(horarioHoje.hora_fechamento);

    // Se o fechamento for no dia seguinte (ex: abre 18:00, fecha 02:00)
    if (fechamentoHoje < aberturaHoje) {
      fechamentoHoje.setDate(fechamentoHoje.getDate() + 1);
    }

    if (agora >= aberturaHoje && agora <= fechamentoHoje) {
      estaAberto = true;
    }
  }

  // 2. VERIFICA SE ESTAMOS NO HORÁRIO "VIRADO" DE ONTEM
  // (Apenas se o restaurante não estiver aberto pelo horário de hoje)
  if (!estaAberto) {
    const horarioOntem = horarios.find(h => h.dia_da_semana.toLowerCase() === diaAnteriorStr);
    if (horarioOntem) {
      const aberturaOntem = criarDataComHoraDeHoje(horarioOntem.hora_abertura);
      aberturaOntem.setDate(aberturaOntem.getDate() - 1); // Garante que a data é de ontem

      const fechamentoOntem = criarDataComHoraDeHoje(horarioOntem.hora_fechamento);
      // Se a data de fechamento for menor que a de abertura, significa que vira a noite
      if (fechamentoOntem < aberturaOntem) {
        // Não precisa ajustar a data do fechamento, pois ela já "virou" para hoje
        if (agora >= aberturaOntem && agora <= fechamentoOntem) {
          estaAberto = true;
        }
      }
    }
  }

  const status = estaAberto
    ? { texto: 'Aberto', classe: 'aberto' }
    : { texto: 'Fechado', classe: 'fechado' };

  return (
    <span className={`${styles.statusBadge} ${styles[status.classe]}`}>
      {status.texto}
    </span>
  );
}

