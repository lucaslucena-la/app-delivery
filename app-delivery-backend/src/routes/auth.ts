import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {

  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Autentica um usuário existente.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Credenciais do usuário para login.',
      required: true,
      schema: {
        $username: 'joao123',
        $password: 'senha123'
      }
    }
    #swagger.responses[200] = {
      description: 'Login bem-sucedido.',
      schema: {
        message: 'Login successful',
        user: {
          id: 1,
          username: 'joao123',
          is_restaurante: false
        }
      }
    }
    #swagger.responses[401] = {
      description: 'Credenciais inválidas.',
      schema: { message: 'Invalid credentials' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante o login.',
      schema: { message: 'Internal server error during login' }
    }
  */

  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM Usuario WHERE usuario = $1', [username]);

    if (result.rowCount === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.senha);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userPayload = {
      id: user.id_usuario,
      username: user.usuario,
      is_restaurante: user.is_restaurante,
      id_restaurante: null ,
      id_cliente: null 

    };

    // NOVO: Se o usuário for um restaurante, busca o ID correspondente
    if (user.is_restaurante) {
      const restauranteResult = await pool.query(
        'SELECT id_restaurante FROM Restaurante WHERE id_usuario = $1',
        [user.id_usuario]
      );

      // Verifica se o resultado da consulta é válido antes de acessar rowCount e rows 
      if (restauranteResult && restauranteResult.rowCount != null && restauranteResult.rowCount > 0) {
        // Adiciona o id_restaurante ao objeto que será enviado ao frontend
        userPayload.id_restaurante = restauranteResult.rows[0].id_restaurante;
      }
    }else{
      // --- NOVO: Lógica para encontrar o ID do cliente ---
      // Se o usuário não é um restaurante, ele é um cliente.
      const clienteResult = await pool.query(
        'SELECT id_cliente FROM Cliente WHERE id_usuario = $1',
        [user.id_usuario]
      );

      // Verifica se o resultado da consulta é válido antes de acessar rowCount e rows
      if (clienteResult && clienteResult.rowCount != null && clienteResult.rowCount > 0) {
        // Adiciona o id_cliente ao objeto que será enviado ao frontend
        userPayload.id_cliente = clienteResult.rows[0].id_cliente;
      }
    }

    return res.status(200).json({ message: 'Login successful', user: userPayload });

  
  } catch (e: any) {
    console.error('Error during login:', e);
    return res.status(500).json({ message: 'Internal server error during login' });
  }

});

router.post('/cadastro', async (req: Request, res: Response): Promise<any> => {

  /*
    #swagger.tags = ['Auth']
    #swagger.summary = 'Registra um novo usuário (cliente ou restaurante).'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do usuário para cadastro.',
      required: true,
      schema: {
        $username: 'novo_usuario',
        $email: 'novo@email.com',
        $password: 'senha_segura123',
        $is_restaurante: false
      }
    }
    #swagger.responses[201] = {
      description: 'Usuário cadastrado com sucesso.',
      schema: {
        id: 7,
        username: 'novo_usuario',
        is_restaurante: false
      }
    }
    #swagger.responses[400] = {
      description: 'Dados incompletos para o cadastro do usuário.',
      schema: { message: 'Todos os campos obrigatorios (username, email, password, is_restaurante) devem ser preenchidos.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante o cadastro.',
      schema: { message: 'Internal server error during user registration' }
    }
  */

 const { username, email, password, is_restaurante, endereco, telefone, id_tipo_culinaria } = req.body;

  if (is_restaurante && (!endereco || !telefone || !id_tipo_culinaria)) {
      return res.status(400).json({ message: 'Para cadastrar um restaurante, os campos endereço, telefone e tipo de culinária são obrigatórios.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const resultUser = await client.query(
      'INSERT INTO "usuario" (usuario, email, senha, is_restaurante) VALUES ($1, $2, $3, $4) RETURNING id_usuario, usuario, is_restaurante',
      [username, email, hashedPassword, is_restaurante]
    );
    const newUser = resultUser.rows[0];

    if (newUser.is_restaurante) {
      const resultRestaurante = await client.query(
        'INSERT INTO "restaurante" (id_usuario, nome, email, endereco, telefone) VALUES ($1, $2, $3, $4, $5) RETURNING id_restaurante',
        [newUser.id_usuario, newUser.usuario, email, endereco, telefone]
      );
      const novoRestauranteId = resultRestaurante.rows[0].id_restaurante;

      await client.query(
        'INSERT INTO "tipo_culinaria_restaurante" (id_restaurante, id_tipo_culinaria) VALUES ($1, $2)',
        [novoRestauranteId, id_tipo_culinaria]
      );
    }

    await client.query('COMMIT');

    return res.status(201).json({ 
        message: 'Usuário registrado com sucesso!', 
        user: { 
            id: newUser.id_usuario, 
            username: newUser.usuario, 
            is_restaurante: newUser.is_restaurante 
        } 
    });

  } catch (e: any) {
    await client.query('ROLLBACK');
    
    console.error('Error during user registration transaction:', e);
    if (e.code === '23505') {
      return res.status(400).json({ message: 'Usuário ou email já cadastrado.' });
    }
    return res.status(500).json({ message: 'Erro interno durante o cadastro do usuário.' });
  
  } finally {
    client.release();
  }
});


export default router;