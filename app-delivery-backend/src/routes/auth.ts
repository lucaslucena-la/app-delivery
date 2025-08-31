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

    return res.status(200).json({ message: 'Login successful', user: { id: user.id_usuario, username: user.usuario, is_restaurante: user.is_restaurante } });

  } catch (e) {
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
  const { username, email, password, is_restaurante } = req.body;

  try {
    if (!username || !email || !password || is_restaurante === undefined) {
      return res.status(400).json({ message: 'Todos os campos obrigatorios (username, email, password, is_restaurante) devem ser preenchidos.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO Usuario (usuario, email, senha, is_restaurante) VALUES ($1, $2, $3, $4) RETURNING id_usuario, usuario, is_restaurante',
      [username, email, hashedPassword, is_restaurante]
    );

    const newUser = result.rows[0];
    return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id_usuario, username: newUser.usuario, is_restaurante: newUser.is_restaurante } });

  } catch (e) {
    console.error('Error during user registration:', e);
    return res.status(500).json({ message: 'Internal server error during user registration' });
  }
});

export default router;
