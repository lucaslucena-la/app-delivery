import { api } from "./api";

export interface AvaliacaoPayload {
  id_pedido: number;
  id_cliente: number;
  id_restaurante: number;
  nota: number;
  comentarios?: string;
}

/** Envia uma nova avaliação para a API. */
export async function submitAvaliacao(payload: AvaliacaoPayload) {
  const { data } = await api.post('/avaliacoes', payload);
  return data;
}
