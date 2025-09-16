import { api } from "./api";

// Estrutura de dados retornada pela API para um restaurante
export type Restaurante = {
  id_restaurante: number;
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  id_usuario: number; // FK para usuário dono do restaurante
  horarios: Horario[];
};

// Representa os dados de horário como vêm do BANCO DE DADOS
export type Horario = {
  id_horario: number;
  dia_da_semana: string;
  hora_abertura: string; // Formato de timestamp completo
  hora_fechamento: string; // Formato de timestamp completo
  id_restaurante: number;
};

// --- NOVO TIPO ---
// Representa os dados de horário que o FRONT-END ENVIA para a API
export type HorarioPayload = {
  dia_da_semana: string;
  hora_abertura: string | null; // Formato "HH:mm"
  hora_fechamento: string | null; // Formato "HH:mm"
};

// Estrutura mínima usada na criação de um restaurante
export type RestauranteInput = {
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
};

// Estrutura de dados para pratos do restaurante
export type Prato = {
  id_prato: number;
  id_restaurante: number;
  nome: string;
  descricao: string;
  valor: number;   // em centavos
  estoque: number;
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
  descricao: string;
};

export interface PedidoResponse {
  id_pedido: number;
  nome_cliente: string;
  id_cliente: number;
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

export interface UpdateRestaurantePayload {
  nome: string;
  endereco: string;
  telefone: string;
  email?: string;
  senha?: string;
}

export interface DashboardData {
  contagemPedidos: {
    aguardando: number;
    em_preparo: number;
    a_caminho: number;
  };
  metricasHoje: {
    faturamento: number;
    totalPedidos: number;
  };
  estoqueBaixo: {
    id_prato: number;
    nome: string;
    estoque: number;
  }[];
  ultimasAvaliacoes: {
    nome_cliente: string;
    nota: number;
    comentario: string;
  }[];
}

export async function getRestauranteDetalhes(id_restaurante: number): Promise<Restaurante> {
  const { data } = await api.get(`/restaurante/${id_restaurante}`);
  return data;
}

export async function listarRestaurantes(): Promise<Restaurante[]> {
  const { data } = await api.get("/restaurante");
  return data;
}

export async function catalogoRestaurante(id: number): Promise<Prato[]> {
  const { data } = await api.get("/restaurante/catalogo", {
    params: { id },
  });
  return data;
}

export async function criarRestaurante(payload: RestauranteInput): Promise<Restaurante> {
  const { data } = await api.post("/restaurante", payload);
  return data;
}
  
export async function criarPrato(payload: PratoInput): Promise<Prato> {
  const { data } = await api.post("/restaurante/prato", payload);
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
  const { data } = await api.get("/tipos-culinaria");
  return data;
}

export async function getPedidosRestaurante(id_restaurante: number): Promise<PedidoResponse[]> {
  const { data } = await api.get(`/restaurante/${id_restaurante}/pedidos`);
  return data;
}

export async function updateRestaurante(id_restaurante: number, payload: UpdateRestaurantePayload) {
  const { data } = await api.put(`/restaurante/${id_restaurante}`, payload);
  return data;
}

export async function getDashboardData(id_restaurante: number): Promise<DashboardData> {
  const { data } = await api.get(`/restaurante/${id_restaurante}/dashboard`);
  return data;
}

export async function updateHorarios(id_restaurante: number, horarios: HorarioPayload[]) {
  const { data } = await api.put(`/restaurante/${id_restaurante}/horarios`, horarios);
  return data;
}

