import { api } from "./api";

// Estrutura de dados retornada pela API para um restaurante
export type Restaurante = {
  id_restaurante: number;
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  id_usuario: number; // FK para usuário dono do restaurante
};

// Estrutura mínima usada na criação de um restaurante (sem id_usuario/id_restaurante)
export type RestauranteInput = {
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
};

// Estrutura de dados para pratos do restaurante
export type Prato = {
  id_prato: number;
  id_restaurante: number; // relação com restaurante
  nome: string;
  descricao: string;
  valor: number;   // em centavos
  estoque: number; // controle de disponibilidade
  id_categoria: number;
};


export type PratoInput = {
  id_restaurante: number;
  nome: string;
  descricao: string;
  valor: number;   // em centavos
  estoque: number;
  id_categoria: number;
};

export type TipoCulinaria = {
  id_tipo_culinaria: number;
  descricao: string; // Ex: 'italiana', 'japonesa'
};

export interface PedidoResponse {
  id_pedido: number;
  nome_cliente: string; // <-- ATUALIZADO
  id_cliente: number; // A API retorna o ID do cliente
  id_restaurante: number;
  data_pedido: string;
  status: string;
  forma_pagamento: string;
  valor: number;
  taxa: number;
  items: {
    id_item_pedido: number;
    nome_prato: string;
    id_prato: number;
    quantidade_item: number;
    infos_adicionais: string;
    preco_por_item: number;
  }[];
}

/** Lista todos os restaurantes cadastrados no sistema */
export async function listarRestaurantes() {
  const { data } = await api.get<Restaurante[]>("/restaurante");
  return data; // retorna array de Restaurantes
}

/** Retorna o cardápio (pratos) de um restaurante específico */
export async function catalogoRestaurante(id: number) {
  const { data } = await api.get<Prato[]>("/restaurante/catalogo", {
    params: { id }, // envia como query param
  });
  return data; // retorna array de Pratos
}


export async function criarRestaurante(payload: RestauranteInput) {
  const { data } = await api.post<Restaurante>("/restaurante", payload);
  return data; // retorna o Restaurante recém-criado
}
  
export async function criarPrato(payload: PratoInput) {
  // A rota no backend para criar um prato é /restaurante/prato
  const { data } = await api.post<Prato>("/restaurante/prato", payload);
  return data;
}

export async function atualizarPrato(id_prato: number, dados: Partial<PratoInput>): Promise<Prato> {
  const response = await api.put(`/restaurante/prato/${id_prato}`, dados);
  return response.data;
}

export async function excluirPrato(id_prato: number): Promise<void> {
  await api.delete(`/restaurante/prato/${id_prato}`);
}

export async function getTiposCulinaria(): Promise<TipoCulinaria[]> {
  const { data } = await api.get<TipoCulinaria[]>("/tipos-culinaria");
  return data;
}

export async function getPedidosRestaurante(id_restaurante: number): Promise<PedidoResponse[]> {
  const { data } = await api.get(`/restaurante/${id_restaurante}/pedidos`);
  return data;
}
