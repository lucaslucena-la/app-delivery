import pool from './pool';
import * as fs from 'fs';
import * as path from 'path';

async function createTables() {
  try {
    const sqlFilePath = path.join(__dirname, 'db.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing SQL to create tables...');
    await pool.query(sql);
    console.log('Tables created successfully!');
    return;
  } catch (err) {
    console.error('Error creating tables:', err);
  }
}

createTables();
