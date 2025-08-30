import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Pedidos']
    #swagger.summary = 'Cria um novo pedido.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados para criar um novo pedido.',
      required: true,
      schema: {
        $id_cliente: 1,
        $id_restaurante: 1,
        $forma_pagamento: 'pix',
        $items: [
          {
            $id_prato: 1,
            $quantidade_item: 1,
            infos_adicionais: 'Sem cebola'
          },
          {
            $id_prato: 2,
            $quantidade_item: 2,
            infos_adicionais: ''
          }
        ]
      }
    }
    #swagger.responses[201] = {
      description: 'Pedido criado com sucesso.',
      schema: {
        message: 'Pedido criado com sucesso',
        pedido: {
          id_pedido: 5,
          id_cliente: 1,
          id_restaurante: 1,
          data_pedido: '2024-01-01T10:00:00.000Z',
          status: 'pedido_esperando_ser_aceito',
          forma_pagamento: 'pix',
          valor: 8500,
          taxa: 2550
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos ou incompletos.',
      schema: { message: 'Todos os campos obrigatorios (id_cliente, id_restaurante, forma_pagamento, items) devem ser preenchidos e items nao pode ser vazio.' }
    }
    #swagger.responses[404] = {
      description: 'Prato não encontrado para o restaurante especificado.',
      schema: { message: 'Prato com ID X nao encontrado para este restaurante.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante a criação do pedido.',
      schema: { message: 'Internal server error during order creation' }
    }
  */
  const { id_cliente, id_restaurante, forma_pagamento, items } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    if (!id_cliente || !id_restaurante || !forma_pagamento || !items || !Array.isArray(items) || items.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Todos os campos obrigatorios (id_cliente, id_restaurante, forma_pagamento, items) devem ser preenchidos e items nao pode ser vazio.' });
    }

    const validPaymentMethods = ['pix', 'em_especie', 'credito', 'debito'];
    if (!validPaymentMethods.includes(forma_pagamento)) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: 'Forma de pagamento invalida.' });
    }

    let totalOrderValue = 0;
    const orderItemsDetails = [];

    for (const item of items) {
      if (!item.id_prato || item.quantidade_item === undefined || item.quantidade_item <= 0) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Cada item do pedido deve ter id_prato e quantidade_item valida.' });
      }

      const dishResult = await client.query('SELECT valor, estoque FROM Lista_de_Pratos WHERE id_prato = $1 AND id_restaurante = $2 FOR UPDATE', [item.id_prato, id_restaurante]);

      if (dishResult.rowCount === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: `Prato com ID ${item.id_prato} nao encontrado para este restaurante.` });
      }

      const dish = dishResult.rows[0];

      if (dish.estoque < item.quantidade_item) {
        await client.query('ROLLBACK'); // se nao tem estoque
        return res.status(400).json({ message: `Estoque insuficiente para o prato ${item.id_prato}. Disponivel: ${dish.estoque}, Requisitado: ${item.quantidade_item}.` });
      }

      const itemPrice = dish.valor * item.quantidade_item;
      totalOrderValue += itemPrice;
      orderItemsDetails.push({ ...item, preco_por_item: dish.valor });

      await client.query('UPDATE Lista_de_Pratos SET estoque = estoque - $1 WHERE id_prato = $2', [item.quantidade_item, item.id_prato]);
    }

    const taxa = totalOrderValue * 0.3;
    const orderResult = await client.query(
      'INSERT INTO Pedido (id_cliente, id_restaurante, data_pedido, status, forma_pagamento, valor, taxa) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id_cliente, id_restaurante, new Date(), 'pedido_esperando_ser_aceito', forma_pagamento, totalOrderValue, taxa]
    );
    const newOrder = orderResult.rows[0];

    for (const itemDetail of orderItemsDetails) {
      await client.query(
        'INSERT INTO Item_Pedido (id_prato, id_pedido, quantidade_item, infos_adicionais, preco_por_item) VALUES ($1, $2, $3, $4, $5)',
        [itemDetail.id_prato, newOrder.id_pedido, itemDetail.quantidade_item, itemDetail.infos_adicionais || null, itemDetail.preco_por_item]
      );
    }

    await client.query('COMMIT'); // salva todas as queries e commita pro banco
    return res.status(201).json({ message: 'Pedido criado com sucesso', pedido: newOrder });

  } catch (e) {
    await client.query('ROLLBACK');
    return res.status(500).json({ message: 'Internal server error' });
  } finally {
    client.release();
  }
});

export default router;
