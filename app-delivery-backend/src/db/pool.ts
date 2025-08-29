import pg from 'pg';
require('dotenv').config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: Number(process.env.port),
  database: process.env.database
});

export default pool;
