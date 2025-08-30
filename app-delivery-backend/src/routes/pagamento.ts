import { Router, Request, Response } from 'express';
import pool from '../db/pool';
const router = Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Pagamento']
    #swagger.summary = 'Processa o pagamento no final de um pedido.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do pagamento do pedido.',
      required: true,
      schema: {
        $id_pedido: 1,
        $forma_pagamento: 'credito'
      }
    }
    #swagger.responses[200] = {
      description: 'Pagamento processado com sucesso.',
      schema: { message: 'Pagamento processado com sucesso.', pedido: {
        id_pedido: 1,
        id_cliente: 1,
        id_restaurante: 1,
        data_pedido: '2024-01-15T19:30:00.000Z',
        status: 'completo',
        forma_pagamento: 'credito',
        valor: 4500,
        taxa: 1350,
      }}
    }
    #swagger.responses[400] = {
      description: 'Dados incompletos para processar o pagamento.',
      schema: { message: 'id_pedido e forma_pagamento sao obrigatorios.' }
    }
    #swagger.responses[404] = {
      description: 'Pedido nao encontrado.',
      schema: { message: 'Pedido nao encontrado.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante o processamento do pagamento.',
      schema: { message: 'Internal server error during payment processing' }
    }
  */
  const { id_pedido, forma_pagamento } = req.body;

  try {
    if (!id_pedido || !forma_pagamento) {
      return res.status(400).json({ message: 'id_pedido e forma_pagamento sao obrigatorios.' });
    }

    const validPaymentMethods = ['pix', 'em_especie', 'credito', 'debito'];
    if (!validPaymentMethods.includes(forma_pagamento)) {
      return res.status(400).json({ message: 'Forma de pagamento invalida.' });
    }

    // Pagamento so pode acontecer no ato da entrega
    const result = await pool.query(
      `UPDATE Pedido SET forma_pagamento = $1, status = 'completo' WHERE id_pedido = $2 RETURNING *`,
      [forma_pagamento, id_pedido]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pedido nao encontrado.' });
    }

    return res.status(200).json({ message: 'Pagamento processado com sucesso.', pedido: result.rows[0] });

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
