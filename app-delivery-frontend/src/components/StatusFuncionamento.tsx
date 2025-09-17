import React from 'react';
import type { Horario } from '../services/restaurante';
import styles from './StatusFuncionamento.module.css';

interface Props {
  horarios: Horario[];
}

// Mapeia o getDay() do JavaScript para os nomes dos dias que vêm do seu banco
const diasDaSemana = [
  'Domingo', 
  'Segunda-feira', 
  'Terça-feira', 
  'Quarta-feira', 
  'Quinta-feira', 
  'Sexta-feira', 
  'Sábado'
];

/**
 * Converte uma string de data/hora (ex: "2024-01-01 18:00:00") 
 * para um número total de minutos desde a meia-noite (ex: 18:30 -> 1110).
 * Isso simplifica a comparação de horários.
 */
const getMinutosDesdeMeiaNoite = (dataString: string) => {
    const data = new Date(dataString);
    return data.getHours() * 60 + data.getMinutes();
};

/**
 * Verifica se um horário de funcionamento "vira a noite" 
 * (ex: abre às 18:00 de um dia e fecha às 02:00 do dia seguinte).
 */
const ehHorarioNoturno = (abertura: string, fechamento: string) => {
    return new Date(fechamento).getDate() !== new Date(abertura).getDate();
};

export default function StatusFuncionamento({ horarios }: Props) {
  const agora = new Date();
  const diaAtualStr = diasDaSemana[agora.getDay()];
  const diaAnteriorStr = diasDaSemana[(agora.getDay() - 1 + 7) % 7];
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  let estaAberto = false;

  const horarioHoje = horarios.find(h => h.dia_da_semana === diaAtualStr);
  const horarioOntem = horarios.find(h => h.dia_da_semana === diaAnteriorStr);

  // Cenário 1: Verifica o horário de hoje
  if (horarioHoje) {
    const aberturaMinutos = getMinutosDesdeMeiaNoite(horarioHoje.hora_abertura);
    // Se o horário vira a noite (ex: abre 18:00, fecha 02:00)
    if (ehHorarioNoturno(horarioHoje.hora_abertura, horarioHoje.hora_fechamento)) {
      if (minutosAgora >= aberturaMinutos) {
        estaAberto = true; // Está aberto se já passou da hora de abertura de hoje
      }
    } else { // Se o horário é no mesmo dia (ex: abre 10:00, fecha 22:00)
      const fechamentoMinutos = getMinutosDesdeMeiaNoite(horarioHoje.hora_fechamento);
      if (minutosAgora >= aberturaMinutos && minutosAgora < fechamentoMinutos) {
        estaAberto = true;
      }
    }
  }

  // Cenário 2: Verifica se ainda estamos no horário de ontem que virou a noite
  if (horarioOntem && ehHorarioNoturno(horarioOntem.hora_abertura, horarioOntem.hora_fechamento)) {
    const fechamentoMinutos = getMinutosDesdeMeiaNoite(horarioOntem.hora_fechamento);
    if (minutosAgora < fechamentoMinutos) {
      estaAberto = true; // Está aberto se ainda não passou da hora de fechamento de ontem
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

