import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

const router = Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {

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

  const { username, email, password, is_restaurante, endereco, telefone } = req.body;

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

    // Se o usuário for restaurante → cria também na tabela Restaurante
    if (newUser.is_restaurante) {
      // 2. Adicionamos os novos campos ao comando SQL INSERT
      await pool.query(
        'INSERT INTO Restaurante (id_usuario, nome, email, endereco, telefone) VALUES ($1, $2, $3, $4, $5)',
        [newUser.id_usuario, newUser.usuario, email, endereco, telefone] // <-- Passando os novos valores
      );
    }

    return res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id_usuario, username: newUser.usuario, is_restaurante: newUser.is_restaurante } });

  } catch (e) {
    console.error('Error during user registration:', e);
    return res.status(500).json({ message: 'Internal server error during user registration' });
  }
});

export default router;