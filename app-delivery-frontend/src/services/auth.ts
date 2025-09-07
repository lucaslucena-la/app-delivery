import { api } from "./api";

// Tipo de usuário esperado pela API
export type User = {
  id: number;
  username: string;
  is_restaurante: boolean;
  id_restaurante?: number;
};

// Função de login -> envia username e password e retorna {message, user}
export async function loginRequest(payload: { username: string; password: string }) {
  const { data } = await api.post<{ message: string; user: User }>("/auth/login", payload);
  return data; // retorna a resposta da API já desestruturada
}

// Função de cadastro -> envia dados do novo usuário (cliente ou restaurante)
export async function registerRequest(payload: {
  username: string;
  email: string;
  password: string;
  is_restaurante: boolean;
  endereco?: string;
  telefone?: string;
  id_tipo_culinaria: number; 
}) {
  const { data } = await api.post("/auth/cadastro", payload);
  return data; // retorna a resposta da API (pode ser mensagem ou user criado)
}
