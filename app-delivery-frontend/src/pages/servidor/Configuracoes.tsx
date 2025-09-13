import React, { useState, useEffect, type FormEvent } from 'react';
import { getUser } from '../../store/auth';
// Supondo que você terá um serviço para buscar os detalhes do restaurante
// import { getRestauranteDetalhes } from '../../services/restaurante';
import styles from './Configuracoes.module.css'; // Criaremos este arquivo a seguir

export function Configuracoes() {
  // Estados para os dados do restaurante
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  
  // Estados para os dados da conta (segurança)
  const [email, setEmail] = useState('');
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');

  // Estados de controle
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Efeito para carregar os dados iniciais do restaurante
  useEffect(() => {
    const carregarDados = async () => {
      const user = getUser();
      if (user && user.id_restaurante) {
        setIsLoading(true);
        try {
          // --- LÓGICA FICTÍCIA ---
          // Quando a rota existir, a lógica será chamada aqui:
          // const dados = await getRestauranteDetalhes(user.id_restaurante);
          // setNome(dados.nome);
          // setEndereco(dados.endereco);
          // setTelefone(dados.telefone);
          // setEmail(dados.email); // O e-mail pode vir do objeto do usuário

          // Por enquanto, vamos usar dados de exemplo:
          setTimeout(() => {
            setNome('Pizza Palace');
            setEndereco('Rua das Pizzas, 123');
            setTelefone('(11) 4445-5566');
            setEmail(user.email || 'contato@pizzapalace.com');
            setIsLoading(false);
          }, 1000); // Simula o tempo de carregamento
          
        } catch (error) {
          setFeedback({ type: 'error', message: 'Erro ao carregar os dados do restaurante.' });
          setIsLoading(false);
        }
      }
    };

    carregarDados();
  }, []);

  const handleUpdateRestaurante = (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    console.log('Dados do restaurante para salvar:', { nome, endereco, telefone });
    // Lógica de chamada da API (PUT/PATCH /api/restaurante/:id) virá aqui
    setFeedback({ type: 'success', message: 'Dados do restaurante salvos com sucesso! (Simulação)' });
  };

  const handleUpdateSeguranca = (e: FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    if (novaSenha !== confirmarNovaSenha) {
      setFeedback({ type: 'error', message: 'As novas senhas não coincidem.' });
      return;
    }
    console.log('Dados de segurança para salvar:', { email, senhaAtual, novaSenha });
    // Lógica de chamada da API (PATCH /api/usuario/senha) virá aqui
    setFeedback({ type: 'success', message: 'Dados de segurança salvos com sucesso! (Simulação)' });
  };

  if (isLoading) {
    return <div className={styles.container}><p>Carregando configurações...</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Configurações</h1>

      {feedback && (
        <div className={`${styles.feedbackMessage} ${styles[feedback.type]}`}>
          {feedback.message}
        </div>
      )}
      
      {/* Formulário de Dados do Restaurante */}
      <section className={styles.card}>
        <h2>Dados do Restaurante</h2>
        <form onSubmit={handleUpdateRestaurante} className={styles.form}>
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
          <button type="submit" className={styles.button}>Salvar Alterações</button>
        </form>
      </section>

      {/* Formulário de Segurança da Conta */}
      <section className={styles.card}>
        <h2>Segurança da Conta</h2>
        <form onSubmit={handleUpdateSeguranca} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className={styles.input} />
          </div>
          <hr className={styles.divider}></hr>
          <h4>Alterar senha</h4>
          <div className={styles.formGroup}>
            <label htmlFor="senhaAtual" className={styles.label}>Senha Atual</label>
            <input id="senhaAtual" type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="novaSenha" className={styles.label}>Nova Senha</label>
            <input id="novaSenha" type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••" required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmarNovaSenha" className={styles.label}>Confirmar Nova Senha</label>
            <input id="confirmarNovaSenha" type="password" value={confirmarNovaSenha} onChange={e => setConfirmarNovaSenha(e.target.value)} placeholder="••••••••" required className={styles.input} />
          </div>
          <button type="submit" className={styles.button}>Atualizar Segurança</button>
        </form>
      </section>
    </div>
  );
}