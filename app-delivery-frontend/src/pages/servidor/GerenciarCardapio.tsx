// src/pages/servidor/GerenciarCardapio.tsx

import React, { useState, useEffect, type FormEvent } from 'react';
import { criarPrato, catalogoRestaurante } from '../../services/restaurante';
import type { Prato, PratoInput } from '../../services/restaurante';
import { getUser } from '../../store/auth';
import { CATEGORIAS_PRATOS } from '../../constants/categorias'; 
import styles from './GerenciarCardapio.module.css'; 


// Função helper para formatar o valor (mantida)
function formatarValor(valorEmCentavos: number) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(valorEmCentavos / 100);
}

function getCategoriaNome(id: number): string {
  const categoria = CATEGORIAS_PRATOS.find(cat => cat.id === id);
  return categoria ? categoria.nome : 'Desconhecida'; // Retorna o nome ou um texto padrão
}

export function GerenciarCardapio() {
    // --- Estados para a lista de pratos ---
    const [pratos, setPratos] = useState<Prato[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    // --- Estados para os campos do formulário ---
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [estoque, setEstoque] = useState('');
    
    // 2. ALTERADO: O estado inicial usa o ID da primeira categoria da nossa constante
    const [idCategoria, setIdCategoria] = useState(String(CATEGORIAS_PRATOS[0].id));

    // --- Estados para feedback e controle do formulário ---
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

    // useEffect para buscar os pratos quando o componente carregar (lógica mantida)
    useEffect(() => {
        const carregarPratos = async () => {
            const user = getUser();
            if (!user?.is_restaurante || !user.id_restaurante) {
                setFetchError("Você precisa estar logado como um restaurante para ver esta página.");
                setIsLoading(false);
                return;
            }

            try {
                const data = await catalogoRestaurante(user.id_restaurante);
                setPratos(data);
            } catch (error: any) {
                setFetchError(error.message || "Falha ao buscar o cardápio.");
            } finally {
                setIsLoading(false);
            }
        };

        carregarPratos();
    }, []);

    // handleFormSubmit continua igual
    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);
        setSubmitError(null);
        setSubmitSuccess(null);

        const user = getUser();
        if (!user?.id_restaurante) {
            setSubmitError("Não foi possível identificar o restaurante. Por favor, faça login novamente.");
            setIsSubmitting(false);
            return;
        }
        const idRestauranteLogado = user.id_restaurante;

        const valorEmCentavos = Math.round(parseFloat(valor.replace(',', '.')) * 100);
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

        try {
            const pratoCriado = await criarPrato(dadosNovoPrato);
            setPratos(pratosAtuais => [...pratosAtuais, pratoCriado]);
            setSubmitSuccess('Prato cadastrado com sucesso!');
            
            // Limpa o formulário
            setNome('');
            setDescricao('');
            setValor('');
            setEstoque('');
            setIdCategoria(String(CATEGORIAS_PRATOS[0].id)); // Reseta para a primeira categoria

        } catch (error) {
            console.error('Erro ao cadastrar prato:', error);
            setSubmitError('Não foi possível cadastrar o prato. Verifique os dados e tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gerenciar Cardápio</h1>
      
      <section className={styles.card}>
        <h2>Adicionar Novo Prato</h2>
        <form onSubmit={handleFormSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>Nome do Prato</label>
            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required disabled={isSubmitting} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descricao" className={styles.label}>Descrição</label>
            <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required disabled={isSubmitting} className={styles.textarea} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="valor" className={styles.label}>Valor (R$)</label>
            <input id="valor" type="number" step="0.01" min="0" value={valor} onChange={(e) => setValor(e.target.value)} required disabled={isSubmitting} className={styles.input} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="estoque" className={styles.label}>Quantidade em Estoque</label>
            <input id="estoque" type="number" min="0" value={estoque} onChange={(e) => setEstoque(e.target.value)} required disabled={isSubmitting} className={styles.input} />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="categoria" className={styles.label}>Categoria</label>
            <select id="categoria" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required disabled={isSubmitting} className={styles.select}>
              {CATEGORIAS_PRATOS.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
          
          <div>
            <button type="submit" disabled={isSubmitting} className={styles.button}>
              {isSubmitting ? 'Salvando...' : 'Salvar Novo Prato'}
            </button>
          </div>

          {submitError && <p className={`${styles.feedbackMessage} ${styles.error}`}>{submitError}</p>}
          {submitSuccess && <p className={`${styles.feedbackMessage} ${styles.success}`}>{submitSuccess}</p>}
        </form>
      </section>

      <section className={styles.card}>
        <h2>Pratos Cadastrados</h2>
        {isLoading ? <p>Carregando pratos...</p> : 
         fetchError ? <p className={`${styles.feedbackMessage} ${styles.error}`}>{fetchError}</p> : 
         pratos.length === 0 ? <p>Nenhum prato cadastrado ainda.</p> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Estoque</th>
              </tr>
            </thead>
            <tbody>
              {pratos.map(prato => (
                <tr key={prato.id_prato}>
                  <td>{prato.nome}</td>
                  <td>{prato.descricao}</td>
                  <td>{getCategoriaNome(prato.id_categoria)}</td> {/* <-- NOVO */}
                  <td>{formatarValor(prato.valor)}</td>
                  <td>{prato.estoque} un.</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}