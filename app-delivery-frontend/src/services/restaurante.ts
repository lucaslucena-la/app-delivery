import { api } from "./api";

export type Restaurante = {
  id_restaurante: number;
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  id_usuario: number;
};

export type RestauranteInput = {
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
};

export type Prato = {
  id_prato: number;
  id_restaurante: number;
  nome: string;
  descricao: string;
  valor: number;   // em centavos
  estoque: number;
  id_categoria: number;
};

/** Lista todos os restaurantes */
export async function listarRestaurantes() {
  const { data } = await api.get<Restaurante[]>("/restaurante");
  return data;
}

/** Retorna o cardápio (pratos) de um restaurante específico */
export async function catalogoRestaurante(id: number) {
  const { data } = await api.get<Prato[]>("/restaurante/catalogo", {
    params: { id },
  });
  return data;
}

/** Etapa 2: cria o registro na TABELA restaurante vinculado ao usuário logado */
export async function criarRestaurante(payload: RestauranteInput) {
  const { data } = await api.post<Restaurante>("/restaurante", payload);
  return data;
}

/** Retorna o restaurante do usuário logado (se existir) */
export async function meuRestaurante() {
  const { data } = await api.get<Restaurante>("/restaurante/me");
  return data;
}

/** (Opcional) Buscar um restaurante específico por id */
export async function getRestaurante(id: number) {
  const { data } = await api.get<Restaurante>(`/restaurante/${id}`);
  return data;
}
