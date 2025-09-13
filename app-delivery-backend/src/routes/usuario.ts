import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

const router = Router();

router.put('/:id_usuario', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Usuário']
    #swagger.summary = 'Atualiza as informações de um usuário e seu telefone de cliente associado.'
    #swagger.parameters['id_usuario'] = {
      in: 'path',
      description: 'ID do usuário a ser atualizado.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Novas informações do usuário e cliente. Email, senha e telefone são opcionais, mas se fornecidos, não podem ser vazios.',
      required: true,
      schema: {
        email: 'novo_email@example.com',
        senha: 'nova_senha_segura',
        telefone: '9988776655'
      }
    }
    #swagger.responses[200] = {
      description: 'Usuário e/ou telefone do cliente atualizados com sucesso.',
      schema: {
        id_usuario: 1,
        usuario: 'username_example',
        email: 'novo_email@example.com',
        is_restaurante: false,
        cliente_id_cliente: 1,
        cliente_nome: 'Nome do Cliente',
        cliente_telefone: '9988776655',
        cliente_cpf: '12345678901'
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos. ID de usuário inválido, ou campos de email/senha/telefone vazios se fornecidos.'
    }
    #swagger.responses[404] = {
      description: 'Usuário ou cliente associado não encontrado.'
    }
    #swagger.responses[409] = {
      description: 'Email já cadastrado para outro usuário.'
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.'
    }
  */
  const { id_usuario } = req.params;
  const { email, senha, telefone } = req.body;

  const userId = parseInt(id_usuario, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: 'ID de usuário inválido.' });
  }

  if (email !== undefined && typeof email === 'string' && !email.trim()) {
    return res.status(400).json({ message: 'O email não pode ser vazio se fornecido.' });
  }
  if (senha !== undefined && typeof senha === 'string' && !senha.trim()) {
    return res.status(400).json({ message: 'A senha não pode ser vazia se fornecida.' });
  }
  if (telefone !== undefined && typeof telefone === 'string' && !telefone.trim()) {
    return res.status(400).json({ message: 'O telefone não pode ser vazio se fornecido.' });
  }

  try {
    const existingDataResult = await pool.query(
      `SELECT
         u.id_usuario, u.email AS current_user_email,
         c.id_cliente, c.telefone AS current_client_telefone
       FROM Usuario u
       LEFT JOIN Cliente c ON u.id_usuario = c.id_usuario
       WHERE u.id_usuario = $1;`,
      [userId]
    );

    if (existingDataResult.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const { current_user_email, id_cliente } = existingDataResult.rows[0];

    if (email && email !== current_user_email) {
      const existingUserWithEmail = await pool.query(
        `SELECT id_usuario FROM Usuario WHERE email = $1;`,
        [email]
      );
      if (existingUserWithEmail.rows.length > 0 && existingUserWithEmail.rows[0].id_usuario !== userId) {
        return res.status(409).json({ message: 'Email já cadastrado para outro usuário.' });
      }
    }

    const usuarioUpdateFields = [];
    const usuarioUpdateValues = [];
    let paramIndex = 1;

    if (email) {
      usuarioUpdateFields.push(`email = $${paramIndex++}`);
      usuarioUpdateValues.push(email);
    }
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      usuarioUpdateFields.push(`senha = $${paramIndex++}`);
      usuarioUpdateValues.push(hashedPassword);
    }

    let updatedUserData;
    if (usuarioUpdateFields.length > 0) {
      const usuarioQuery = `
        UPDATE Usuario
        SET ${usuarioUpdateFields.join(', ')}
        WHERE id_usuario = $${paramIndex}
        RETURNING id_usuario, usuario, email, is_restaurante;
      `;
      const result = await pool.query(usuarioQuery, [...usuarioUpdateValues, userId]);
      updatedUserData = result.rows[0];
    } else {
      const result = await pool.query(`SELECT id_usuario, usuario, email, is_restaurante FROM Usuario WHERE id_usuario = $1;`, [userId]);
      updatedUserData = result.rows[0];
    }

    let updatedClientData = null;
    if (id_cliente && telefone) {
      const clientUpdateFields = [];
      const clientUpdateValues = [];
      let clientParamIndex = 1;

      clientUpdateFields.push(`telefone = $${clientParamIndex++}`);
      clientUpdateValues.push(telefone);

      const clientQuery = `
        UPDATE Cliente
        SET ${clientUpdateFields.join(', ')}
        WHERE id_cliente = $${clientParamIndex}
        RETURNING id_cliente, nome, telefone, cpf;
      `;
      const result = await pool.query(clientQuery, [...clientUpdateValues, id_cliente]);
      updatedClientData = result.rows[0];
    } else if (id_cliente) {
      const result = await pool.query(`SELECT id_cliente, nome, telefone, cpf FROM Cliente WHERE id_cliente = $1;`, [id_cliente]);
      updatedClientData = result.rows[0];
    }

    const finalResponse: any = {
      ...updatedUserData,
    };

    if (updatedClientData) {
      finalResponse.cliente_id_cliente = updatedClientData.id_cliente;
      finalResponse.cliente_nome = updatedClientData.nome;
      finalResponse.cliente_telefone = updatedClientData.telefone;
      finalResponse.cliente_cpf = updatedClientData.cpf;
    }
    res.status(200).json(finalResponse);

  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

export default router;
