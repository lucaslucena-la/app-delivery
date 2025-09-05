import React, { useState } from 'react';
import type { FormEvent } from 'react';
import { criarPrato } from '../../services/restaurante';
import type { PratoInput } from '../../services/restaurante';


// Você pode criar um arquivo CSS para estilizar esta página
// import styles from './GerenciarCardapio.module.css';

export function GerenciarCardapio() {
  // --- Estados para os campos do formulário ---
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  // Guardamos o valor como string para facilitar a manipulação no input (ex: "45,90")
  const [valor, setValor] = useState('');
  const [estoque, setEstoque] = useState('');
  const [idCategoria, setIdCategoria] = useState('');

  // --- Estados para feedback e controle do formulário ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);


  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Previne que a página recarregue ao submeter
    
    // Reseta os estados de feedback antes de uma nova submissão
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(null);

    // !! IMPORTANTE !!
    // Você precisa de uma forma de obter o ID do restaurante que está logado.
    // Isso geralmente vem de um Contexto de Autenticação, Redux, Zustand, ou outra forma de gerenciamento de estado global.
    // Por enquanto, usaremos um valor fixo como exemplo.
    const idRestauranteLogado = 1; // SUBSTITUIR PELA LÓGICA REAL

    // Converte o valor do prato de uma string (ex: "45,90") para um inteiro em centavos (ex: 4590)
    const valorEmCentavos = Math.round(parseFloat(valor.replace(',', '.')) * 100);

    // Validação simples
    if (isNaN(valorEmCentavos) || valorEmCentavos <= 0) {
      setSubmitError('O valor do prato é inválido.');
      setIsSubmitting(false);
      return;
    }

    const dadosNovoPrato: PratoInput = {
      id_restaurante: idRestauranteLogado,
      nome,
      descricao,
      valor: valorEmCentavos,
      estoque: parseInt(estoque, 10),
      id_categoria: parseInt(idCategoria, 10),
    };

    // --- Chamada à API ---
    try {
      await criarPrato(dadosNovoPrato);
      
      setSubmitSuccess('Prato cadastrado com sucesso!');
      
      // Limpa os campos do formulário após o sucesso
      setNome('');
      setDescricao('');
      setValor('');
      setEstoque('');
      setIdCategoria('');

      // TODO: Adicionar lógica para recarregar a lista de pratos na tela.

    } catch (error) {
      console.error('Erro ao cadastrar prato:', error);
      setSubmitError('Não foi possível cadastrar o prato. Verifique os dados e tente novamente.');
    } finally {
      // Esta linha será executada sempre, seja em caso de sucesso ou erro
      setIsSubmitting(false);
    }
  };

  return (
    // Recomendaria usar uma classe no container para estilização, ex: className={styles.container}
    <div>
      <h1>Gerenciar Cardápio</h1>
      
      <section>
        <h2>Adicionar Novo Prato</h2>
        <form onSubmit={handleFormSubmit}>
          {/* Campo Nome */}
          <div>
            <label htmlFor="nome">Nome do Prato</label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Pizza Grande de Calabresa"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Campo Descrição */}
          <div>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Molho de tomate, queijo muçarela, calabresa e orégano"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Campo Valor */}
          <div>
            <label htmlFor="valor">Valor (R$)</label>
            <input
              id="valor"
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="Ex: 55,90"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Campo Estoque */}
          <div>
            <label htmlFor="estoque">Quantidade em Estoque</label>
            <input
              id="estoque"
              type="number"
              value={estoque}
              onChange={(e) => setEstoque(e.target.value)}
              placeholder="Ex: 100"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Campo Categoria */}
          <div>
            <label htmlFor="categoria">ID da Categoria</label>
            {/* O ideal aqui futuramente será um <select> carregado com as categorias do restaurante */}
            <input
              id="categoria"
              type="number"
              value={idCategoria}
              onChange={(e) => setIdCategoria(e.target.value)}
              placeholder="Ex: 1 (para Pizzas)"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Mensagens de Feedback */}
          {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
          {submitSuccess && <p style={{ color: 'green' }}>{submitSuccess}</p>}
          
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Novo Prato'}
          </button>
        </form>
      </section>

      <hr style={{ margin: '40px 0' }} />

      <section>
        <h2>Pratos Cadastrados</h2>
        {/* Aqui entrará a lógica para listar os pratos existentes */}
        <p>A lista de pratos aparecerá aqui em breve.</p>
      </section>
    </div>
  );
}