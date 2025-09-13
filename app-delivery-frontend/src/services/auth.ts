import { api } from "./api";

export type User = {
  id: number;
  username: string;
  is_restaurante: boolean;
  id_cliente?: number;
  id_restaurante?: number;
  token: string;
};

// A função de login não precisa de alterações
export async function loginRequest(payload: { username: string; password: string }) {
  const { data } = await api.post<{ message: string; user: User }>("/auth/login", payload);
  return data;
}

// Adicionamos os novos campos de cliente como opcionais ao payload
export async function registerRequest(payload: {
  // Campos de Usuário (comuns a ambos)
  username: string;
  email: string;
  password: string;
  is_restaurante: boolean;
  
  // Campos específicos do Restaurante
  endereco?: string;
  id_tipo_culinaria?: number; 
  
  // --- CAMPOS PARA O CLIENTE ---
  nome_completo?: string;
  cpf?: string;
  
  // Campo de telefone (usado por ambos)
  telefone?: string;
}) {
  const { data } = await api.post("/auth/cadastro", payload);
  return data;
}
