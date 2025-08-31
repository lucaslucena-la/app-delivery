import { api } from "./api";

export type User = {
  id: number;
  username: string;
  is_restaurante: boolean;
};

export async function loginRequest(payload: { username: string; password: string }) {
  const { data } = await api.post<{ message: string; user: User }>("/auth/login", payload);
  return data;
}

export async function registerRequest(payload: {
  username: string;
  email: string;
  password: string;
  is_restaurante: boolean;
}) {
  const { data } = await api.post("/auth/cadastro", payload);
  return data;
}
