import React, { useState, useEffect, type FormEvent } from 'react';
import type { Prato, PratoInput } from '../../services/restaurante';
import { CATEGORIAS_PRATOS } from '../../constants/categorias';
import styles from './GerenciarCardapio.module.css'; // Vamos reaproveitar os estilos

// Props que o modal receberá
interface ModalEditarPratoProps {
  prato: Prato | null;
  onClose: () => void;
  onSave: (dadosAtualizados: Partial<PratoInput>) => void;
}

export function ModalEditarPrato({ prato, onClose, onSave }: ModalEditarPratoProps) {
  // Estados locais para os campos do formulário do modal
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [estoque, setEstoque] = useState('');
  const [idCategoria, setIdCategoria] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useEffect para popular o formulário quando um prato é selecionado
  useEffect(() => {
    if (prato) {
      setNome(prato.nome);
      setDescricao(prato.descricao);
      // O valor vem em centavos, precisa converter para a exibição no input
      setValor((prato.valor / 100).toFixed(2).replace('.', ','));
      setEstoque(String(prato.estoque));
      setIdCategoria(String(prato.id_categoria));
    }
  }, [prato]);

  if (!prato) {
    return null; // Não renderiza nada se não houver prato para editar
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const valorEmCentavos = Math.round(parseFloat(valor.replace(',', '.')) * 100);

    const dadosAtualizados: Partial<PratoInput> = {
      nome,
      descricao,
      valor: valorEmCentavos,
      estoque: parseInt(estoque, 10),
      id_categoria: parseInt(idCategoria, 10),
    };

    try {
      await onSave(dadosAtualizados);
    } catch (err) {
      console.error("Erro no modal de edição:", err); // <-- USANDO A VARIÁVEL 'err'
      setError('Falha ao atualizar o prato. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }

  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Editar Prato</h2>
        <form onSubmit={handleSubmit}>
          {/* Reutilizando a estrutura e estilos do formulário principal */}
          <div className={styles.formGroup}>
            <label htmlFor="edit-nome" className={styles.label}>Nome do Prato</label>
            <input id="edit-nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-descricao" className={styles.label}>Descrição</label>
            <textarea id="edit-descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} required className={styles.textarea} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-valor" className={styles.label}>Valor (R$)</label>
            <input id="edit-valor" type="text" value={valor} onChange={(e) => setValor(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-estoque" className={styles.label}>Quantidade em Estoque</label>
            <input id="edit-estoque" type="number" min="0" value={estoque} onChange={(e) => setEstoque(e.target.value)} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="edit-categoria" className={styles.label}>Categoria</label>
            <select id="edit-categoria" value={idCategoria} onChange={(e) => setIdCategoria(e.target.value)} required className={styles.select}>
              {CATEGORIAS_PRATOS.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nome}</option>
              ))}
            </select>
          </div>
          
          {error && <p className={`${styles.feedbackMessage} ${styles.error}`}>{error}</p>}
          
          <div className={styles.modalActions}>
            <button type="button" onClick={onClose} className={`${styles.button} ${styles.buttonSecondary}`}>
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className={styles.button}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}