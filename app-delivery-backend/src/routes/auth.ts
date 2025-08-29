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

    return res.status(200).json({ message: 'Login successful', user: { id: user.id, username: user.usuario, is_restaurante: user.is_restaurante } });

  } catch (e) {
    console.error('Error during login:', e);
    return res.status(500).json({ message: 'Internal server error during login' });
  }
});

export default router;
