import React, { useState, useEffect, type FormEvent } from 'react';
import { getUser } from '../../store/auth';
import { getClienteDetalhes, updateCliente } from '../../services/cliente';
import styles from './MeuPerfil.module.css';

export default function MeuPerfil() {
  // Estados para os dados do perfil
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');

  // Estados para a alteração de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  
  // Estados de controle
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      const user = getUser();
      if (user && user.id_cliente) {
        try {
          const dados = await getClienteDetalhes(user.id_cliente);
          setNomeCompleto(dados.nome);
          setEmail(dados.email);
          setTelefone(dados.telefone);
          setCpf(dados.cpf);
        } catch (error) {
          setFeedback({ type: 'error', message: 'Erro ao carregar seus dados.' });
        } finally {
          setIsLoading(false);
        }
      } else {
        setFeedback({ type: 'error', message: 'Usuário não encontrado.' });
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    const user = getUser();
    if (!user?.id_cliente) {
      setFeedback({ type: 'error', message: 'Não foi possível identificar o cliente.' });
      setIsSubmitting(false);
      return;
    }

    const payload: any = { nome: nomeCompleto, email, telefone };
    if (novaSenha && senhaAtual) {
      payload.senha_atual = senhaAtual;
      payload.nova_senha = novaSenha;
    } else if (novaSenha && !senhaAtual) {
      setFeedback({ type: 'error', message: 'Por favor, informe sua senha atual para definir uma nova.' });
      setIsSubmitting(false);
      return;
    }

    try {
      await updateCliente(user.id_cliente, payload);
      setFeedback({ type: 'success', message: 'Perfil atualizado com sucesso!' });
      setSenhaAtual('');
      setNovaSenha('');
    } catch (err: any) {
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Erro ao atualizar o perfil.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className={styles.container}><p>Carregando perfil...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Meu Perfil</h1>
      
      <form onSubmit={handleSave} className={styles.form}>
        <section className={styles.card}>
          <h2>Dados Pessoais</h2>
          <div className={styles.formGroup}>
            <label htmlFor="nomeCompleto">Nome Completo</label>
            <input id="nomeCompleto" type="text" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="cpf">CPF</label>
            <input id="cpf" type="text" value={cpf} disabled />
            <small>Seu CPF não pode ser alterado.</small>
          </div>
        </section>

        <section className={styles.card}>
          <h2>Alterar Senha</h2>
          <p>Para alterar sua senha, preencha os campos abaixo. Caso contrário, deixe-os em branco.</p>
          <div className={styles.formGroup}>
            <label htmlFor="senhaAtual">Senha Atual</label>
            <input id="senhaAtual" type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="novaSenha">Nova Senha</label>
            <input id="novaSenha" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••" />
          </div>
        </section>
        
        {feedback && (
          <div className={`${styles.feedbackMessage} ${styles[feedback.type]}`}>
            {feedback.message}
          </div>
        )}

        <button type="submit" className={styles.button} disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </div>
  );
}

