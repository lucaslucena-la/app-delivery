import { api } from "./api";

export type ItemPedido = {
  nome_prato: string;
  quantidade: number;
  observacoes: string | null;
  preco_item:number;
};

export type Pedido = {
  id_pedido: number;
  nome_cliente: string;
  horario_pedido: string; 
  valor_total: number; // Em centavos
  status: 'pendente' | 'em_preparacao' | 'pronto_entrega' | 'entregue' | 'cancelado';
  itens: ItemPedido[];
};

export const buscarPedidosDoPainel = async (): Promise<Pedido[]> => {
  const { data } = await api.get('/pedidos/painel');
  return data;
};


export const atualizarStatusPedido = async (idPedido: number, novoStatus: string): Promise<{ success: boolean }> => {
  const { data } = await api.put(`/pedidos/painel/${idPedido}/status`, { novoStatus });
  return data;
};

