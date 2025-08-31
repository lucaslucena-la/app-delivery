import { api } from "./api";

type ItemPedidoPayload = {
  id_prato: number;
  quantidade_item: number;
  infos_adicionais?: string;
};

export async function criarPedido(payload: {
  id_cliente: number;
  id_restaurante: number;
  forma_pagamento: "pix" | "em_especie" | "credito" | "debito";
  items: ItemPedidoPayload[];
}) {
  const { data } = await api.post("/pedido", payload);
  return data; // retorna { message, pedido }
}

export async function pagarPedido(payload: {
  id_pedido: number;
  forma_pagamento: "pix" | "em_especie" | "credito" | "debito";
}) {
  const { data } = await api.post("/pagamento", payload);
  return data;
}
