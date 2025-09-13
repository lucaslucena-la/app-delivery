import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { catalogoRestaurante } from "../services/restaurante.ts";
import type { Prato } from "../services/restaurante.ts";
import { useCarrinho } from "../context/CarrinhoContext.tsx";
import ModalConfirmacao from "../components/ModalConfirmacao.tsx";

export default function Catalogo() {
  const { id } = useParams();
  
  // --- ALTERADO: Pegamos as novas funções e o ID do restaurante do carrinho ---
  const { adicionarItem, clearCart, restauranteId } = useCarrinho(); 
  
  const [pratos, setPratos] = useState<Prato[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // --- NOVO: Estados para controlar o modal de confirmação ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pratoPendente, setPratoPendente] = useState<Prato | null>(null);

  useEffect(() => {
    if (!id) return;
    catalogoRestaurante(Number(id)).then(setPratos).catch(e => {
      setErr(e?.response?.data?.message || "Erro ao carregar catálogo");
    });
  }, [id]);

  // --- LÓGICA PRINCIPAL ATUALIZADA ---
  function handleAdicionarAoCarrinho(prato: Prato) {
    // Verifica se o carrinho já tem itens e se o restaurante é diferente
    if (restauranteId && restauranteId !== prato.id_restaurante) {
      // Se for diferente, guarda o prato e abre o modal
      setPratoPendente(prato);
      setIsModalOpen(true);
    } else {
      // Se não, adiciona o item normalmente
      adicionarItem(prato);
      setFeedback(`${prato.nome} adicionado ao carrinho!`);
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  // --- NOVA FUNÇÃO: Chamada quando o usuário confirma no modal ---
  function handleEsvaziarEAdicionar() {
    if (pratoPendente) {
      clearCart(); // Esvazia o carrinho
      adicionarItem(pratoPendente); // Adiciona o novo item
      setFeedback(`${pratoPendente.nome} adicionado ao carrinho!`);
      setTimeout(() => setFeedback(null), 2000);
    }
    // Fecha o modal e limpa o estado
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

      <div style={{ maxWidth: 800, margin: "2rem auto", padding: 16 }}>
        <h2>Catálogo</h2>
        {err && <p style={{ color: "crimson" }}>{err}</p>}
        {feedback && <p style={{ color: "green" }}>{feedback}</p>}

        {pratos.map(p => (
          <div key={p.id_prato} style={{ border: "1px solid #eee", padding: 12, borderRadius: 8, marginBottom: 8 }}>
            <strong>{p.nome}</strong>
            <div>{p.descricao}</div>
            <div>Preço: R$ {(p.valor / 100).toFixed(2)}</div>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => handleAdicionarAoCarrinho(p)}>Adicionar ao Carrinho</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
