import React, { useState, useEffect, type FormEvent } from 'react';
import { getUser } from '../../store/auth';
// --- ALTERADO: Importamos a nova função de busca ---
import { updateRestaurante, getRestauranteDetalhes } from '../../services/restaurante';
import styles from './Configuracoes.module.css';

export function Configuracoes() {
  // Os estados não mudam
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const carregarDados = async () => {
      const user = getUser();
      if (user && user.id_restaurante) {
        try {
          // Chama a nova função de serviço para buscar os dados reais
          const dadosDoRestaurante = await getRestauranteDetalhes(user.id_restaurante);
          
          // Preenche os campos do formulário com os dados retornados pela API
          setNome(dadosDoRestaurante.nome);
          setEndereco(dadosDoRestaurante.endereco);
          setTelefone(dadosDoRestaurante.telefone);
          setEmail(dadosDoRestaurante.email);

        } catch (error) {
          setFeedback({ type: 'error', message: 'Erro ao carregar os dados do restaurante.' });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        setFeedback({ type: 'error', message: 'Usuário de restaurante não encontrado.' });
      }
    };

    carregarDados();
  }, []); // O array vazio garante que isso rode apenas uma vez, quando o componente é montado

  // A função de salvar continua a mesma, pois já estava correta
  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsSubmitting(true);

    const user = getUser();

    // --- LOG 1: VERIFICAR SE O ID DO RESTAURANTE EXISTE ---
    console.log("Tentando salvar. ID do restaurante:", user?.id_restaurante);

    if (!user?.id_restaurante) {
      setFeedback({ type: 'error', message: 'Não foi possível identificar o restaurante.' });
      setIsSubmitting(false);
      return;
    }
    
    const payload: any = { nome, endereco, telefone };
    if (email) payload.email = email;
    if (senha) payload.senha = senha;

    // --- LOG 2: VERIFICAR OS DADOS QUE SERÃO ENVIADOS ---
    console.log("Dados que serão enviados para a API:", payload);

    try {
      // A chamada da API acontece aqui
      await updateRestaurante(user.id_restaurante, payload);

      // --- LOG 3: SUCESSO NO FRONT-END ---
      console.log("API retornou sucesso!");
      setFeedback({ type: 'success', message: 'Configurações salvas com sucesso!' });
      setSenha('');

    } catch (err: any) {
      // --- LOG 4: ERRO NO FRONT-END ---
      console.error("A chamada para a API falhou:", err);
      setFeedback({ type: 'error', message: err?.response?.data?.message || 'Erro ao salvar configurações.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configurações</h1>

      {isLoading ? (
        <p>Carregando dados do restaurante...</p>
      ) : (
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

          <button type="submit" className={styles.button} disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Salvando...' : 'Salvar Todas as Alterações'}
          </button>
        </form>
      )}
    </div>
  );
}

