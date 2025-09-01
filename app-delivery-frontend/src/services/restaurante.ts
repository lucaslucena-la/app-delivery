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
