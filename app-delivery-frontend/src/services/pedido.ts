import { api } from "./api";

// Estrutura de cada item dentro de um pedido
type ItemPedidoPayload = {
  id_prato: number;          // identifica o prato
  quantidade_item: number;   // quantidade do prato
  infos_adicionais?: string; // ex: "sem cebola", "bem passado"
};

// Criação de um novo pedido (cliente → restaurante)
export async function criarPedido(payload: {
  id_cliente: number;
  id_restaurante: number;
  forma_pagamento: "pix" | "em_especie" | "credito" | "debito";
  items: ItemPedidoPayload[]; // lista de pratos escolhidos
}) {
  const { data } = await api.post("/pedido", payload);
  return data; // esperado: { message, pedido }
}

// Realizar pagamento de um pedido existente
export async function pagarPedido(payload: {
  id_pedido: number; // id do pedido já criado
  forma_pagamento: "pix" | "em_especie" | "credito" | "debito";
}) {
  const { data } = await api.post("/pagamento", payload);
  return data; // esperado: confirmação de pagamento
}
