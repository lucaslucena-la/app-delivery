import { Router, Request, Response } from 'express';
import pool from '../db/pool';
const router = Router();

router.post('/', async (req: Request, res: Response): Promise<any> => {
  
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
