import axios from "axios";
// Cria uma instância do axios com uma configuração padrão e a exporta.
export const api = axios.create({
  // Define a URL base para todas as requisições, usando uma variável de ambiente.
  baseURL: import.meta.env.VITE_API_URL,
});
