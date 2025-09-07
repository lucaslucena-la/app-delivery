import { Router, Request, Response } from 'express';
import pool from '../db/pool';

const router = Router();

router.get('/', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna todos os restaurantes cadastrados.'
    #swagger.responses[200] = {
      description: 'Lista de restaurantes.',
      schema: [{
        id_restaurante: 1,
        nome: 'Pizza Palace',
        email: 'contato@pizzapalace.com',
        endereco: 'Rua das Pizzas, 123',
        telefone: '11444555666',
        id_usuario: 3
      }]
    }
    #swagger.responses[404] = {
      description: 'Nenhum restaurante foi encontrado.',
      schema: { message: 'Nenhum restaurante foi encontrado.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.',
      schema: { message: 'Internal server error' }
    }
  */

  try {
    const result = await pool.query('SELECT * FROM Restaurante;');

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum restaurante foi encontrado.' });
    }

    return res.status(200).json(result.rows);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/catalogo', async (req: Request, res: Response): Promise<any> => {

  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna o catálogo de pratos de um restaurante específico.'
    #swagger.parameters['id'] = {
      in: 'query',
      description: 'ID do restaurante',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.responses[200] = {
      description: 'Catálogo de pratos do restaurante.',
      schema: [{
        id_prato: 1,
        id_restaurante: 1,
        nome: 'Pizza Margherita',
        descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão',
        valor: 3500,
        estoque: 50,
        id_categoria: 6
      }]
    }
    #swagger.responses[400] = {
      description: 'ID do restaurante não fornecido.',
      schema: { message: 'Id eh necessario para requisitar o catalogo do resturante.' }
    }
    #swagger.responses[404] = {
      description: 'Restaurante nao tem nenhum prato cadastrado.',
      schema: { message: 'Restaurante nao tem nenhum prato cadastrado.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.',
      schema: { message: 'Internal server error' }
    }
  */

  const id = req.query.id;

  try {
    if (!id) {
      return res.status(400).json({ message: 'Id eh necessario para requisitar o catalogo do resturante.' });
    }
    const result = await pool.query('SELECT * FROM Lista_de_Pratos where id_restaurante = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Restaurante nao tem nenhum prato cadastrado.' });
    }

    return res.status(200).json(result.rows);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/por-tipo-culinaria', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna restaurantes de um tipo de culinária específico.'
    #swagger.parameters['tipo'] = {
      in: 'query',
      description: 'Tipo de culinária para filtrar os restaurantes (e.g., italiana, japonesa).',
      required: true,
      type: 'string',
      enum: ['generalista','italiana', 'churrascaria', 'cafeteria', 'lanchonete', 'japonesa', 'sobremesas'],
      example: 'italiana'
    }
    #swagger.responses[200] = {
      description: 'Lista de restaurantes encontrados para o tipo de culinária.',
      schema: [{
        id_restaurante: 1,
        nome: 'Pizza Palace',
        email: 'contato@pizzapalace.com',
        endereco: 'Rua das Pizzas, 123',
        telefone: '11444555666',
        id_usuario: 3
      }]
    }
    #swagger.responses[400] = {
      description: 'Tipo de culinária não fornecido.',
      schema: { message: 'O tipo de culinária eh necessario para filtrar os restaurantes.' }
    }
    #swagger.responses[404] = {
      description: 'Nenhum restaurante encontrado para o tipo de culinária especificado.',
      schema: { message: 'Nenhum restaurante encontrado para o tipo de culinaria especificado.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.',
      schema: { message: 'Internal server error' }
    }
  */

  const tipo = req.query.tipo;

  try {
    if (!tipo) {
      return res.status(400).json({ message: 'O tipo de culinária eh necessario para filtrar os restaurantes.' });
    }

    const result = await pool.query(
      `SELECT
          R.id_restaurante,
          R.nome,
          R.email,
          R.endereco,
          R.telefone,
          R.id_usuario
        FROM
          Restaurante AS R
        JOIN
          Tipo_Culinaria_Restaurante AS TCR ON R.id_restaurante = TCR.id_restaurante
        JOIN
          Tipo_Culinaria AS TC ON TCR.id_tipo_culinaria = TC.id_tipo_culinaria
        WHERE
          TC.descricao = $1;`,
      [tipo]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum restaurante encontrado para o tipo de culinaria especificado.' });
    }

    return res.status(200).json(result.rows);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/por-categoria-prato', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna restaurantes que oferecem pratos de uma categoria específica.'
    #swagger.parameters['categoria'] = {
      in: 'query',
      description: 'Categoria do prato para filtrar os restaurantes (e.g., combos, salgados, doces).',
      required: true,
      type: 'string',
      enum: ['combos', 'baratos', 'salgados', 'doces', 'frios', 'quentes'],
      example: 'salgados'
    }
    #swagger.responses[200] = {
      description: 'Lista de restaurantes encontrados que oferecem pratos da categoria.',
      schema: [{
        id_restaurante: 1,
        nome: 'Pizza Palace',
        email: 'contato@pizzapalace.com',
        endereco: 'Rua das Pizzas, 123',
        telefone: '11444555666',
        id_usuario: 3
      }]
    }
    #swagger.responses[400] = {
      description: 'Categoria de prato não fornecida.',
      schema: { message: 'A categoria do prato eh necessaria para filtrar os restaurantes.' }
    }
    #swagger.responses[404] = {
      description: 'Nenhum restaurante encontrado para a categoria de prato especificada.',
      schema: { message: 'Nenhum restaurante encontrado para a categoria de prato especificada.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.',
      schema: { message: 'Internal server error' }
    }
  */

  const categoria = req.query.categoria;

  try {
    if (!categoria) {
      return res.status(400).json({ message: 'A categoria do prato eh necessaria para filtrar os restaurantes.' });
    }

    const result = await pool.query(
      `SELECT DISTINCT
          R.id_restaurante,
          R.nome,
          R.email,
          R.endereco,
          R.telefone,
          R.id_usuario
        FROM
          Restaurante AS R
        JOIN
          Lista_de_Pratos AS LP ON R.id_restaurante = LP.id_restaurante
        JOIN
          Categoria_Pratos AS CP ON LP.id_categoria = CP.id_categoria
        WHERE
          CP.descricao = $1;`,
      [categoria]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nenhum restaurante encontrado para a categoria de prato especificada.' });
    }

    return res.status(200).json(result.rows);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/prato', async (req: Request, res: Response): Promise<any> => {

  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Cadastra um novo prato para um restaurante.'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do prato para cadastro.',
      required: true,
      schema: {
        $id_restaurante: 1,
        $nome: 'Pizza Calabresa',
        $descricao: 'Pizza com molho de tomate, mussarela e calabresa',
        $valor: 4000,
        $estoque: 100,
        $id_categoria: 6
      }
    }
    #swagger.responses[201] = {
      description: 'Prato cadastrado com sucesso.',
      schema: {
        id_prato: 10,
        id_restaurante: 1,
        nome: 'Pizza Calabresa',
        descricao: 'Pizza com molho de tomate, mussarela e calabresa',
        valor: 4000,
        estoque: 100,
        id_categoria: 6
      }
    }
    #swagger.responses[400] = {
      description: 'Dados incompletos para o cadastro do prato.',
      schema: { message: 'Todos os campos obrigatorios (id_restaurante, nome, descricao, valor, estoque, id_categoria) devem ser preenchidos.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante o cadastro do prato.',
      schema: { message: 'Internal server error' }
    }
  */

  const { id_restaurante, nome, descricao, valor, estoque, id_categoria } = req.body;

  try {
    if (!id_restaurante || !nome || !descricao || valor === undefined || estoque === undefined || !id_categoria) {
      return res.status(400).json({ message: 'Todos os campos obrigatorios (id_restaurante, nome, descricao, valor, estoque, id_categoria) devem ser preenchidos.' });
    }

    const result = await pool.query(
      'INSERT INTO Lista_de_Pratos (id_restaurante, nome, descricao, valor, estoque, id_categoria) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [id_restaurante, nome, descricao, valor, estoque, id_categoria]
    );

    return res.status(201).json(result.rows[0]);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;
