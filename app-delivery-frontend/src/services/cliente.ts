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

export interface Endereco {
  id_endereco: number;
  id_cliente: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado_siga: string;
  cep: string;
}

export type EnderecoPayload = Omit<Endereco, 'id_endereco' | 'id_cliente'>;


/**
 * Atualiza os dados do perfil de um cliente.
 * @param id_cliente O ID do cliente.
 * @param payload Os dados a serem atualizados.
 */
export async function updateCliente(id_cliente: number, payload: UpdateClientePayload) {
  const { data } = await api.put(`/cliente/${id_cliente}`, payload);
  return data;
}

/** Busca todos os endereços de um cliente. */
export async function getEnderecos(id_cliente: number): Promise<Endereco[]> {
  const { data } = await api.get(`/cliente/${id_cliente}/enderecos`);
  return data;
}

/** Adiciona um novo endereço para um cliente. */
export async function addEndereco(id_cliente: number, payload: EnderecoPayload): Promise<Endereco> {
  const { data } = await api.post(`/cliente/${id_cliente}/enderecos`, payload);
  return data;
}

/** Atualiza um endereço existente. */
export async function updateEndereco(id_endereco: number, payload: EnderecoPayload): Promise<Endereco> {
  const { data } = await api.put(`/cliente/enderecos/${id_endereco}`, payload);
  return data;
}

/** Deleta um endereço. */
export async function deleteEndereco(id_endereco: number): Promise<void> {
  await api.delete(`/cliente/enderecos/${id_endereco}`);
}
