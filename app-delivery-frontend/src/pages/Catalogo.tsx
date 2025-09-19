import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { catalogoRestaurante } from "../services/restaurante.ts";
import type { Prato } from "../services/restaurante.ts";
import { useCarrinho } from "../context/CarrinhoContext.tsx";
import ModalConfirmacao from "../components/ModalConfirmacao.tsx";
import styles from "./Catalogo.module.css";

export default function Catalogo() {
  const { id } = useParams();
  const { adicionarItem, clearCart, restauranteId } = useCarrinho();
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pratoPendente, setPratoPendente] = useState<Prato | null>(null);

  useEffect(() => {
    if (!id) return;
    catalogoRestaurante(Number(id)).then(setPratos).catch(e => {
      setErr(e?.response?.data?.message || "Erro ao carregar catálogo");
    });
  }, [id]);

  function handleAdicionarAoCarrinho(prato: Prato) {
    if (restauranteId && restauranteId !== prato.id_restaurante) {
      setPratoPendente(prato);
      setIsModalOpen(true);
    } else {
      adicionarItem(prato);
      setFeedback(`${prato.nome} adicionado ao carrinho!`);
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  function handleEsvaziarEAdicionar() {
    if (pratoPendente) {
      clearCart();
      adicionarItem(pratoPendente);
      setFeedback(`${pratoPendente.nome} adicionado ao carrinho!`);
      setTimeout(() => setFeedback(null), 2000);
    }
    setIsModalOpen(false);
    setPratoPendente(null);
  }

  return (
    <>
      <ModalConfirmacao
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleEsvaziarEAdicionar}
        title=""
      >
        <h3>Você só pode adicionar itens de um restaurante por vez.</h3>
        <p>Deseja esvaziar a sacola e adicionar este novo item?</p>
      </ModalConfirmacao>

      <div className={styles.container}>
        <h2 className={styles.title}>Catálogo</h2>
        {err && <p className={styles.error}>{err}</p>}
        {feedback && <p className={styles.feedback}>{feedback}</p>}

        {pratos.length > 0 ? (
          <div className={styles.grid}>
            {pratos.map(p => (
              <div key={p.id_prato} className={styles.card}>
                <strong className={styles.cardTitle}>{p.nome}</strong>
                <div className={styles.cardDescription}>{p.descricao}</div>
                <div className={styles.cardPrice}>Preço: R$ {(p.valor / 100).toFixed(2)}</div>
                <button
                  onClick={() => handleAdicionarAoCarrinho(p)}
                  className={styles.cardButton}
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyMessage}>Nenhum prato encontrado no momento.</p>
        )}
      </div>
    </>
  );
}