import type { Horario } from '../services/restaurante';

// Esta é a mesma lógica do seu componente StatusFuncionamento, agora em uma função reutilizável.

const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

const getMinutosDesdeMeiaNoite = (dataString: string) => {
    const data = new Date(dataString);
    return data.getHours() * 60 + data.getMinutes();
};

const ehHorarioNoturno = (abertura: string, fechamento: string) => {
    return new Date(fechamento).getDate() !== new Date(abertura).getDate();
};

export function checkIfOpen(horarios: Horario[]): boolean {
  if (!horarios || horarios.length === 0) return false;

  const agora = new Date();
  const diaAtualStr = diasDaSemana[agora.getDay()];
  const diaAnteriorStr = diasDaSemana[(agora.getDay() - 1 + 7) % 7];
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();

  let estaAberto = false;

  const horarioHoje = horarios.find(h => h.dia_da_semana === diaAtualStr);
  const horarioOntem = horarios.find(h => h.dia_da_semana === diaAnteriorStr);

  // Cenário 1: Verifica o horário de hoje
  if (horarioHoje) {
    if (ehHorarioNoturno(horarioHoje.hora_abertura, horarioHoje.hora_fechamento)) {
      if (minutosAgora >= getMinutosDesdeMeiaNoite(horarioHoje.hora_abertura)) {
        estaAberto = true;
      }
    } else {
      const fechamentoMinutos = getMinutosDesdeMeiaNoite(horarioHoje.hora_fechamento);
      if (minutosAgora >= getMinutosDesdeMeiaNoite(horarioHoje.hora_abertura) && minutosAgora < fechamentoMinutos) {
        estaAberto = true;
      }
    }
  }

  // Cenário 2: Verifica se ainda estamos no horário de ontem que "virou a noite"
  if (!estaAberto && horarioOntem && ehHorarioNoturno(horarioOntem.hora_abertura, horarioOntem.hora_fechamento)) {
    const fechamentoMinutos = getMinutosDesdeMeiaNoite(horarioOntem.hora_fechamento);
    if (minutosAgora < fechamentoMinutos) {
      estaAberto = true;
    }
  }

  return estaAberto;
}

