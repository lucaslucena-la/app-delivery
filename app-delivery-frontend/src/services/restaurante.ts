import { api } from "./api";

export type Restaurante = {
  id_restaurante: number;
  nome: string;
  email: string;
  endereco: string;
  telefone: string;
  id_usuario: number;
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

export async function listarRestaurantes() {
  const { data } = await api.get<Restaurante[]>("/restaurante");
  return data;
}

export async function catalogoRestaurante(id: number) {
  const { data } = await api.get<Prato[]>("/restaurante/catalogo", { params: { id } });
  return data;
}
