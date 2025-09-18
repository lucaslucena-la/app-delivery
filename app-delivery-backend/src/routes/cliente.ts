import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

const router = Router();


router.get('/:id_cliente', async (req: Request, res: Response): Promise<any> => {
  const { id_cliente } = req.params;
  try {
    const result = await pool.query(
      `SELECT 
         c.id_cliente, c.nome, c.telefone, c.cpf, u.email, u.usuario AS username
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

router.put('/:id_cliente', async (req: Request, res: Response): Promise<any> => {
  const { id_cliente } = req.params;
  const { nome, email, telefone, username, senha_atual, nova_senha } = req.body;

  if (!nome || !email || !telefone || !username) {
    return res.status(400).json({ message: 'Nome, email, telefone e nome de usuário são obrigatórios.' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `SELECT u.id_usuario, u.senha FROM Usuario u JOIN Cliente c ON u.id_usuario = c.id_usuario WHERE c.id_cliente = $1`,
      [id_cliente]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Cliente não encontrado.' });
    }
    const { id_usuario, senha: senhaHash } = userResult.rows[0];

    // Atualiza a tabela Cliente (apenas nome e telefone)
    await client.query(
      `UPDATE Cliente SET nome = $1, telefone = $2 WHERE id_cliente = $3`,
      [nome, telefone, id_cliente]
    );

    // Monta a query para atualizar a tabela Usuario
    const userUpdateFields = ['email = $1', 'usuario = $2'];
    const userUpdateValues: (string | number)[] = [email, username];
    let paramIndex = 3;

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

  } catch (error: any) {
    await client.query('ROLLBACK');
    // Trata erro de username/email duplicado
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Nome de usuário ou email já está em uso.' });
    }
    res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
});

router.get('/:id_cliente/enderecos', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Cliente']
    #swagger.summary = 'Retorna a lista de endereços de um cliente.'
  */
  const { id_cliente } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM Endereco_Cliente WHERE id_cliente = $1 ORDER BY id_endereco DESC', 
      [id_cliente]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar endereços.' });
  }
});

// --- ROTA PARA ADICIONAR UM NOVO ENDEREÇO ---
router.post('/:id_cliente/enderecos', async (req: Request, res: Response): Promise<any> => {
  const { id_cliente } = req.params;
  const { logradouro, numero, bairro, cidade, estado_siga, cep } = req.body;

  if (!logradouro || !numero || !bairro || !cidade || !estado_siga || !cep) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO Endereco_Cliente (id_cliente, logradouro, numero, bairro, cidade, estado_siga, cep) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id_cliente, logradouro, numero, bairro, cidade, estado_siga, cep]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar endereço.' });
  }
});

// --- ROTA PARA ATUALIZAR UM ENDEREÇO ---
router.put('/enderecos/:id_endereco', async (req: Request, res: Response): Promise<any> => {

  const { id_endereco } = req.params;
  const { logradouro, numero, bairro, cidade, estado_siga, cep } = req.body;

  if (!logradouro || !numero || !bairro || !cidade || !estado_siga || !cep) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  try {
    const result = await pool.query(
      `UPDATE Endereco_Cliente 
       SET logradouro = $1, numero = $2, bairro = $3, cidade = $4, estado_siga = $5, cep = $6
       WHERE id_endereco = $7 RETURNING *`,
      [logradouro, numero, bairro, cidade, estado_siga, cep, id_endereco]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Endereço não encontrado.' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar endereço.' });
  }
});

// --- ROTA PARA DELETAR UM ENDEREÇO ---
router.delete('/enderecos/:id_endereco', async (req: Request, res: Response): Promise<any> => {

  const { id_endereco } = req.params;
  try {
    const result = await pool.query('DELETE FROM Endereco_Cliente WHERE id_endereco = $1', [id_endereco]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Endereço não encontrado.' });
    }
    res.status(200).json({ message: 'Endereço deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar endereço.' });
  }
});

export default router;

