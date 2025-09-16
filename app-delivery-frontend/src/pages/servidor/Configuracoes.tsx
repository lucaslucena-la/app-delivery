import React, { useState, useEffect, type FormEvent } from 'react';
import { getUser } from '../../store/auth.ts';
import { updateRestaurante, getRestauranteDetalhes, updateHorarios, type HorarioPayload } from '../../services/restaurante.ts';
import styles from './Configuracoes.module.css';

const DIAS_SEMANA = [
  "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira",
  "Quinta-feira", "Sexta-feira", "Sábado"
];

export function Configuracoes() {
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [horarios, setHorarios] = useState<HorarioPayload[]>(
    DIAS_SEMANA.map(dia => ({ dia_da_semana: dia, hora_abertura: null, hora_fechamento: null }))
  );
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      const user = getUser();
      if (user?.id_restaurante) {
        try {
          const dados = await getRestauranteDetalhes(user.id_restaurante);
          setNome(dados.nome);
          setEndereco(dados.endereco);
          setTelefone(dados.telefone);
          setEmail(dados.email);

          if (dados.horarios && dados.horarios.length > 0) {
            const horariosDoBanco = dados.horarios.reduce((acc, horario) => {
              acc[horario.dia_da_semana] = horario;
              return acc;
            }, {} as { [key: string]: any });
            
            setHorarios(DIAS_SEMANA.map(dia => {
              const horarioExistente = horariosDoBanco[dia];
              const formatarHora = (dataString: string | null) => {
                if (!dataString) return '';
                return new Date(dataString).toTimeString().slice(0, 5);
              };

              return {
                dia_da_semana: dia,
                hora_abertura: formatarHora(horarioExistente?.hora_abertura),
                hora_fechamento: formatarHora(horarioExistente?.hora_fechamento),
              };
            }));
          }
        } catch (error) {
          setFeedback({ type: 'error', message: 'Erro ao carregar dados do restaurante.' });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setFeedback({ type: 'error', message: 'Usuário de restaurante não encontrado.' });
      }
    };
    carregarDados();
  }, []);
  
  const handleHorarioChange = (index: number, campo: 'hora_abertura' | 'hora_fechamento', valor: string) => {
    const novosHorarios = [...horarios];
    novosHorarios[index][campo] = valor || null;
    setHorarios(novosHorarios);
  };
  
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    const user = getUser();
    if (!user?.id_restaurante) return;
    
    try {
      const payloadRestaurante: any = { nome, endereco, telefone };
      if (email) payloadRestaurante.email = email;
      if (senha) payloadRestaurante.senha = senha;
      await updateRestaurante(user.id_restaurante, payloadRestaurante);

      const horariosParaEnviar = horarios.filter(h => h.hora_abertura && h.hora_fechamento);
      await updateHorarios(user.id_restaurante, horariosParaEnviar);

      setFeedback({ type: 'success', message: 'Configurações salvas com sucesso!' });
      setSenha('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Erro ao salvar.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Carregando...</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configurações</h1>
      <form onSubmit={handleSave} className={styles.form}>
        <section className={styles.card}>
          <h2>Dados do Restaurante</h2>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>Nome do Restaurante</label>
            <input id="nome" type="text" value={nome} onChange={e => setNome(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="endereco" className={styles.label}>Endereço</label>
            <input id="endereco" type="text" value={endereco} onChange={e => setEndereco(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="telefone" className={styles.label}>Telefone</label>
            <input id="telefone" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} required className={styles.input} />
          </div>
        </section>

        <section className={styles.card}>
          <h2>Horário de Funcionamento</h2>
          <p>Deixe os campos em branco para os dias em que o restaurante estiver fechado.</p>
          <div className={styles.horariosGrid}>
            {horarios.map((horario, index) => (
              <div key={horario.dia_da_semana} className={styles.horarioRow}>
                <label className={styles.diaLabel}>{horario.dia_da_semana}</label>
                <input
                  type="time"
                  value={horario.hora_abertura || ''}
                  onChange={(e) => handleHorarioChange(index, 'hora_abertura', e.target.value)}
                  className={styles.timeInput}
                />
                <span>às</span>
                <input
                  type="time"
                  value={horario.hora_fechamento || ''}
                  onChange={(e) => handleHorarioChange(index, 'hora_fechamento', e.target.value)}
                  className={styles.timeInput}
                />
              </div>
            ))}
          </div>
        </section>
        
        <section className={styles.card}>
          <h2>Segurança da Conta</h2>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="senha" className={styles.label}>Nova Senha (deixe em branco para não alterar)</label>
            <input id="senha" type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="••••••••" className={styles.input} />
          </div>
        </section>

        {feedback && (
          <div className={`${styles.feedbackMessage} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}
        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Todas as Alterações'}
        </button>
      </form>
    </div>
  );
}

