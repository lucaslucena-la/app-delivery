import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

// --- ROTA PARA CRIAR UMA NOVA AVALIAÇÃO ---
router.post('/', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Avaliações']
    #swagger.summary = 'Cria uma nova avaliação para um pedido.'
  */
  const { id_pedido, id_cliente, id_restaurante, nota, comentarios } = req.body;

  if (!id_pedido || !id_cliente || !id_restaurante || nota === undefined) {
    return res.status(400).json({ message: 'Campos obrigatórios estão faltando.' });
  }
  if (nota < 0 || nota > 5) {
    return res.status(400).json({ message: 'A nota deve ser entre 0 e 5.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verifica se o pedido já foi avaliado para evitar duplicatas
    const existingReview = await client.query('SELECT avaliacao_id FROM Avaliacoes WHERE id_pedido = $1', [id_pedido]);
    if (existingReview && existingReview.rowCount != null && existingReview.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'Este pedido já foi avaliado.' });
    }

    const result = await client.query(
      `INSERT INTO Avaliacoes (id_pedido, id_cliente, id_restaurante, nota, comentarios, data) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [id_pedido, id_cliente, id_restaurante, nota, comentarios || null]
    );

    await client.query('COMMIT');
    res.status(201).json(result.rows[0]);

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Erro ao salvar avaliação.' });
  } finally {
    client.release();
  }
});

export default router;
