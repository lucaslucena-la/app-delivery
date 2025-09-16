import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

const router = Router();

// --- ROTA PARA BUSCAR DADOS DO CLIENTE ---
router.get('/:id_cliente', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Retorna os detalhes de um cliente específico.'
  */
  const { id_cliente } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         c.id_cliente, c.nome, c.telefone, c.cpf, u.email
       FROM Cliente c
       JOIN Usuario u ON c.id_usuario = u.id_usuario
       WHERE c.id_cliente = $1;`,
      [id_cliente]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// --- ROTA PARA ATUALIZAR DADOS DO CLIENTE (COM TRANSAÇÃO) ---
router.put('/:id_cliente', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Atualiza as informações de um cliente.'
  */
  const { id_cliente } = req.params;
  const { nome, email, telefone, senha_atual, nova_senha } = req.body;

  if (!nome || !email || !telefone) {
    return res.status(400).json({ message: 'Nome, email e telefone são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Busca o id_usuario e a senha atual
    const userResult = await client.query(
      `SELECT u.id_usuario, u.senha FROM Usuario u JOIN Cliente c ON u.id_usuario = c.id_usuario WHERE c.id_cliente = $1`,
      [id_cliente]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    const { id_usuario, senha: senhaHash } = userResult.rows[0];

    // 2. Atualiza a tabela Cliente
    await client.query(
      `UPDATE Cliente SET nome = $1, telefone = $2 WHERE id_cliente = $3`,
      [nome, telefone, id_cliente]
    );

    // 3. Atualiza a tabela Usuario
    const userUpdateFields = ['email = $1'];
    const userUpdateValues: (string | number)[] = [email];
    let paramIndex = 2;

    // Se a nova senha foi fornecida, verifica a senha atual antes de atualizar
    if (nova_senha) {
      if (!senha_atual) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'A senha atual é necessária para definir uma nova.' });
      }
      const passwordMatch = await bcrypt.compare(senha_atual, senhaHash);
      if (!passwordMatch) {
        await client.query('ROLLBACK');
        return res.status(401).json({ message: 'Senha atual incorreta.' });
      }
      const hashedNovaSenha = await bcrypt.hash(nova_senha, 10);
      userUpdateFields.push(`senha = $${paramIndex++}`);
      userUpdateValues.push(hashedNovaSenha);
    }

    const userQuery = `UPDATE Usuario SET ${userUpdateFields.join(', ')} WHERE id_usuario = $${paramIndex}`;
    await client.query(userQuery, [...userUpdateValues, id_usuario]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Perfil atualizado com sucesso!' });

  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
});

export default router;
