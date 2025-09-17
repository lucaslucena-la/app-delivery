import { api } from "./api";

// Interface para os detalhes do cliente retornados pela API
export interface ClienteDetalhes {
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  username: string;
}

// Interface para os dados enviados na atualização
export interface UpdateClientePayload {
  nome: string;
  email: string;
  telefone: string;
  senha_atual?: string;
  nova_senha?: string;
}

/**
 * Busca os detalhes de um cliente específico.
 * @param id_cliente O ID do cliente.
 */
export async function getClienteDetalhes(id_cliente: number): Promise<ClienteDetalhes> {
  const { data } = await api.get(`/cliente/${id_cliente}`);
  return data;
}

/**
 * Atualiza os dados do perfil de um cliente.
 * @param id_cliente O ID do cliente.
 * @param payload Os dados a serem atualizados.
 */
export async function updateCliente(id_cliente: number, payload: UpdateClientePayload) {
  const { data } = await api.put(`/cliente/${id_cliente}`, payload);
  return data;
}
