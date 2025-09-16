import { Router, Request, Response } from 'express';
import pool from '../db/pool';
import bcrypt from 'bcrypt';

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

router.put('/prato/:id_prato', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Atualiza um prato existente no cardápio de um restaurante.'
    #swagger.parameters['id_prato'] = {
      in: 'path',
      description: 'ID do prato a ser atualizado.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Dados do prato para atualização. Pelo menos um campo deve ser fornecido.',
      required: true,
      schema: {
        nome: 'Pizza Vegana',
        descricao: 'Pizza com molho de tomate, queijo vegano e vegetais.',
        valor: 4500,
        estoque: 75,
        id_categoria: 5
      }
    }
    #swagger.responses[200] = {
      description: 'Prato atualizado com sucesso.',
      schema: {
        id_prato: 1,
        id_restaurante: 1,
        nome: 'Pizza Vegana',
        descricao: 'Pizza com molho de tomate, queijo vegano e vegetais.',
        valor: 4500,
        estoque: 75,
        id_categoria: 5
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos ou nenhum campo para atualizar.',
      schema: { message: 'ID do prato inválido ou nenhum campo fornecido para atualização.' }
    }
    #swagger.responses[404] = {
      description: 'Prato não encontrado.',
      schema: { message: 'Prato não encontrado.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante a atualização do prato.',
      schema: { message: 'Internal server error' }
    }
  */

  const { id_prato } = req.params;
  const { nome, descricao, valor, estoque, id_categoria } = req.body;

  try {
    const pratoId = parseInt(id_prato, 10);
    if (isNaN(pratoId)) {
      return res.status(400).json({ message: 'ID do prato inválido.' });
    }

    const fieldsToUpdate: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (nome !== undefined) {
      fieldsToUpdate.push(`nome = $${paramIndex++}`);
      values.push(nome);
    }
    if (descricao !== undefined) {
      fieldsToUpdate.push(`descricao = $${paramIndex++}`);
      values.push(descricao);
    }
    if (valor !== undefined) {
      fieldsToUpdate.push(`valor = $${paramIndex++}`);
      values.push(valor);
    }
    if (estoque !== undefined) {
      fieldsToUpdate.push(`estoque = $${paramIndex++}`);
      values.push(estoque);
    }
    if (id_categoria !== undefined) {
      fieldsToUpdate.push(`id_categoria = $${paramIndex++}`);
      values.push(id_categoria);
    }

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo fornecido para atualização.' });
    }

    values.push(pratoId);

    const query = `UPDATE Lista_de_Pratos SET ${fieldsToUpdate.join(', ')} WHERE id_prato = $${paramIndex} RETURNING *;`;
    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Prato não encontrado.' });
    }

    return res.status(200).json(result.rows[0]);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/prato/:id_prato', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Deleta um prato existente do cardápio de um restaurante.'
    #swagger.parameters['id_prato'] = {
      in: 'path',
      description: 'ID do prato a ser deletado.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.responses[200] = {
      description: 'Prato deletado com sucesso.',
      schema: { message: 'Prato deletado com sucesso.' }
    }
    #swagger.responses[400] = {
      description: 'ID do prato inválido.',
      schema: { message: 'ID do prato inválido.' }
    }
    #swagger.responses[404] = {
      description: 'Prato não encontrado.',
      schema: { message: 'Prato não encontrado.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor durante a exclusão do prato.',
      schema: { message: 'Internal server error' }
    }
  */

  const { id_prato } = req.params;

  try {
    const pratoId = parseInt(id_prato, 10);
    if (isNaN(pratoId)) {
      return res.status(400).json({ message: 'ID do prato inválido.' });
    }

    const result = await pool.query(
      'DELETE FROM Lista_de_Pratos WHERE id_prato = $1 RETURNING *;',
      [pratoId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Prato não encontrado.' });
    }

    return res.status(200).json({ message: 'Prato deletado com sucesso.' });

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

router.get('/:id/pedidos', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna todos os pedidos de um restaurante específico.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do restaurante para buscar os pedidos.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.responses[200] = {
      description: 'Lista de pedidos encontrados para o restaurante.',
      schema: [{
        id_pedido: 5,
        id_cliente: 1,
        id_restaurante: 1,
        data_pedido: '2024-01-01T10:00:00.000Z',
        status: 'pedido_esperando_ser_aceito',
        forma_pagamento: 'pix',
        valor: 8500,
        taxa: 2550,
        items: [
          {
            id_item_pedido: 1,
            id_prato: 1,
            quantidade_item: 1,
            infos_adicionais: 'Sem cebola',
            preco_por_item: 5000
          }
        ]
      }]
    }
    #swagger.responses[400] = {
      description: 'ID do restaurante inválido.',
      schema: { message: 'ID do restaurante inválido.' }
    }
    #swagger.responses[404] = {
      description: 'Nenhum pedido encontrado para o restaurante especificado.',
      schema: { message: 'Nenhum pedido encontrado para o restaurante com ID X.' }
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.',
      schema: { message: 'Internal server error' }
    }
  */
  const { id } = req.params;

  try {
    const restauranteId = parseInt(id, 10);
    if (isNaN(restauranteId)) {
      return res.status(400).json({ message: 'ID do restaurante inválido.' });
    }

    const result = await pool.query(
      `SELECT
         p.*,
         c.nome AS nome_cliente
       FROM Pedido p
       JOIN Cliente c ON p.id_cliente = c.id_cliente
       WHERE p.id_restaurante = $1;`,
      [restauranteId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: `Nenhum pedido encontrado para o restaurante com ID ${restauranteId}.` });
    }

    const ordersWithItems = await Promise.all(result.rows.map(async (order) => {
      const itemsResult = await pool.query(
        `SELECT
           ip.*,
           lp.nome AS nome_prato
         FROM Item_Pedido ip
         JOIN Lista_de_Pratos lp ON ip.id_prato = lp.id_prato
         WHERE ip.id_pedido = $1`,
        [order.id_pedido]
      );
      return { ...order, items: itemsResult.rows };
    }));

    return res.status(200).json(ordersWithItems);

  } catch (e) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna os detalhes de um restaurante específico pelo ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID do restaurante a ser retornado.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.responses[200] = {
      description: 'Detalhes do restaurante encontrados com sucesso.',
      schema: {
        id_restaurante: 1,
        nome: 'Pizza Palace',
        endereco: 'Rua das Pizzas, 123',
        telefone: '11444555666',
        email: 'contato@pizzapalace.com',
        id_usuario: 3
      }
    }
    #swagger.responses[404] = {
      description: 'Restaurante não encontrado.'
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.'
    }
  */
  const { id } = req.params;

  try {
    const restauranteId = parseInt(id, 10);
    if (isNaN(restauranteId)) {
      return res.status(400).json({ message: 'ID do restaurante inválido.' });
    }

    const result = await pool.query(
      `SELECT
         r.id_restaurante,
         r.nome,
         r.endereco,
         r.telefone,
         u.email,
         r.id_usuario
       FROM Restaurante r
       JOIN Usuario u ON r.id_usuario = u.id_usuario
       WHERE r.id_restaurante = $1;`,
      [restauranteId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Restaurante não encontrado.' });
    }

    // Retorna o objeto do restaurante com os detalhes combinados
    return res.status(200).json(result.rows[0]);

  } catch (e) {
    console.error('Erro ao buscar detalhes do restaurante:', e);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

router.put('/:id_restaurante', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Atualiza as informações de um restaurante.'
    #swagger.parameters['id_restaurante'] = {
      in: 'path',
      description: 'ID do restaurante a ser atualizado.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Novas informações do restaurante. Campos como nome, endereço, telefone, email e senha podem ser atualizados. Nome, endereço e telefone são obrigatórios. Email e senha são opcionais, mas se fornecidos, não podem ser vazios.',
      required: true,
      schema: {
        nome: 'Nome do Restaurante Atualizado',
        endereco: 'Novo Endereço, 456',
        telefone: '987654321',
        email: 'novo_email@restaurante.com',
        senha: 'nova_senha_segura'
      }
    }
    #swagger.responses[200] = {
      description: 'Restaurante atualizado com sucesso.',
      schema: {
        id_restaurante: 1,
        nome: 'Nome do Restaurante Atualizado',
        email: 'novo_email@restaurante.com',
        endereco: 'Novo Endereço, 456',
        telefone: '987654321',
        id_usuario: 1
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos. Nome, endereço e telefone são obrigatórios. Email e senha, se fornecidos, não podem ser vazios.'
    }
    #swagger.responses[404] = {
      description: 'Restaurante não encontrado.'
    }
    #swagger.responses[409] = {
      description: 'Email já cadastrado.'
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.'
    }
  */
  const { id_restaurante } = req.params;
  const { nome, endereco, telefone, email, senha } = req.body;

  if (!nome || !endereco || !telefone) {
    return res.status(400).json({ message: 'Nome, endereço e telefone são obrigatórios.' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const userResult = await client.query(
      `SELECT id_usuario FROM Restaurante WHERE id_restaurante = $1;`,
      [id_restaurante]
    );

    if (userResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Restaurante não encontrado.' });
    }
    const { id_usuario } = userResult.rows[0];

    // 2. ATUALIZA A TABELA Restaurante (INCLUINDO O EMAIL)
    const restauranteUpdateFields = ['nome = $1', 'endereco = $2', 'telefone = $3'];
    const restauranteUpdateValues = [nome, endereco, telefone];
    let paramIndex = 4;

    if (email) {
      restauranteUpdateFields.push(`email = $${paramIndex++}`);
      restauranteUpdateValues.push(email);
    }

    const restauranteQuery = `
      UPDATE Restaurante
      SET ${restauranteUpdateFields.join(', ')}
      WHERE id_restaurante = $${paramIndex}
      RETURNING *;
    `;
    const updatedRestaurantResult = await client.query(restauranteQuery, [...restauranteUpdateValues, id_restaurante]);
    const updatedRestaurantData = updatedRestaurantResult.rows[0];

    const usuarioUpdateFields = [];
    const usuarioUpdateValues = [];
    let usuarioParamIndex = 1;

    if (nome) {
      usuarioUpdateFields.push(`usuario = $${usuarioParamIndex++}`);
      usuarioUpdateValues.push(nome);
    }
    if (email) {
      usuarioUpdateFields.push(`email = $${usuarioParamIndex++}`);
      usuarioUpdateValues.push(email);
    }
    if (senha) {
      const hashedPassword = await bcrypt.hash(senha, 10);
      usuarioUpdateFields.push(`senha = $${usuarioParamIndex++}`);
      usuarioUpdateValues.push(hashedPassword);
    }

    let updatedUserData;
    if (usuarioUpdateFields.length > 0) {
      const usuarioQuery = `
        UPDATE Usuario
        SET ${usuarioUpdateFields.join(', ')}
        WHERE id_usuario = $${usuarioParamIndex}
        RETURNING *;
      `;
      const result = await client.query(usuarioQuery, [...usuarioUpdateValues, id_usuario]);
      updatedUserData = result.rows[0];
    } else {
      const result = await client.query(`SELECT * FROM Usuario WHERE id_usuario = $1;`, [id_usuario]);
      updatedUserData = result.rows[0];
    }
    
    await client.query('COMMIT');

    const finalResponse = {
      ...updatedRestaurantData,
      email: updatedUserData.email, // Garante que o email retornado é o mais recente
    };
    
    res.status(200).json(finalResponse);

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro na transação de atualização:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  } finally {
    client.release();
  }
});

router.put('/:id_restaurante/pedido/:id_pedido/status', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Atualiza o status de um pedido específico de um restaurante.'
    #swagger.parameters['id_restaurante'] = {
      in: 'path',
      description: 'ID do restaurante.',
      required: true,
      type: 'integer',
      example: 1
    }
    #swagger.parameters['id_pedido'] = {
      in: 'path',
      description: 'ID do pedido a ser atualizado.',
      required: true,
      type: 'integer',
      example: 101
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Novo status do pedido.',
      required: true,
      schema: {
        status: 'em_preparacao'
      }
    }
    #swagger.responses[200] = {
      description: 'Status do pedido atualizado com sucesso.',
      schema: {
        id_pedido: 101,
        id_cliente: 1,
        id_restaurante: 1,
        data_pedido: '2023-10-27T10:00:00.000Z',
        status: 'em_preparacao',
        forma_pagamento: 'credito',
        valor: 5000,
        taxa: 500
      }
    }
    #swagger.responses[400] = {
      description: 'Requisição inválida (e.g., status inválido, IDs não numéricos).'
    }
    #swagger.responses[404] = {
      description: 'Pedido ou restaurante não encontrado, ou pedido não pertence ao restaurante.'
    }
    #swagger.responses[500] = {
      description: 'Erro interno do servidor.'
    }
  */
  const { id_restaurante, id_pedido } = req.params;
  const { status } = req.body;

  const validStatuses = ['completo', 'em_preparacao', 'a_caminho', 'pedido_esperando_ser_aceito'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Status inválido. Status permitidos: ' + validStatuses.join(', ') + '.' });
  }

  const restauranteId = parseInt(id_restaurante, 10);
  const pedidoId = parseInt(id_pedido, 10);

  if (isNaN(restauranteId) || isNaN(pedidoId)) {
    return res.status(400).json({ message: 'IDs de restaurante ou pedido inválidos.' });
  }

  try {
    const verificationResult = await pool.query(
      `SELECT id_pedido FROM Pedido WHERE id_pedido = $1 AND id_restaurante = $2;`,
      [pedidoId, restauranteId]
    );

    if (verificationResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pedido não encontrado para o restaurante especificado.' });
    }

    const updateQuery = `
      UPDATE Pedido
      SET status = $1
      WHERE id_pedido = $2
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [status, pedidoId]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Pedido não encontrado para atualização.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// --- ROTA PARA O DASHBOARD 
router.get('/:id/dashboard', async (req: Request, res: Response): Promise<any> => {
  /*
    #swagger.tags = ['Restaurante']
    #swagger.summary = 'Retorna os dados consolidados para o dashboard de um restaurante.'
    #swagger.parameters['id'] = { in: 'path', required: true, type: 'integer', description: 'ID do restaurante.' }
    #swagger.responses[200] = {
      description: 'Dados do dashboard retornados com sucesso.',
      schema: {
        contagemPedidos: {
          aguardando: 5,
          em_preparo: 8,
          a_caminho: 3
        },
        metricasHoje: {
          faturamento: 157050,
          totalPedidos: 25
        },
        estoqueBaixo: [
          { id_prato: 12, nome: 'Cheesecake de Morango', estoque: 4 }
        ],
        ultimasAvaliacoes: [
          { nome_cliente: 'Maria S.', nota: 5, comentario: 'Excelente! Chegou rápido e quente.' }
        ]
      }
    }
    #swagger.responses[400] = { description: 'ID do restaurante inválido.' }
    #swagger.responses[404] = { description: 'Restaurante não encontrado.' }
    #swagger.responses[500] = { description: 'Erro interno do servidor.' }
  */
  const { id } = req.params;

  try {
    const restauranteId = parseInt(id, 10);
    if (isNaN(restauranteId)) {
      return res.status(400).json({ message: 'ID do restaurante inválido.' });
    }

    // --- 1. Contagem de Pedidos por Status ---
    const statusResult = await pool.query(
      `SELECT 
         status, 
         COUNT(id_pedido)::int as contagem 
       FROM Pedido 
       WHERE 
         id_restaurante = $1 
         AND status IN ('pedido_esperando_ser_aceito', 'em_preparo', 'a_caminho')
       GROUP BY status;`,
      [restauranteId]
    );

    const contagemPedidos = {
      aguardando: 0,
      em_preparo: 0,
      a_caminho: 0,
    };
    statusResult.rows.forEach(row => {
      if (row.status === 'pedido_esperando_ser_aceito') contagemPedidos.aguardando = row.contagem;
      if (row.status === 'em_preparo') contagemPedidos.em_preparo = row.contagem;
      if (row.status === 'a_caminho') contagemPedidos.a_caminho = row.contagem;
    });


    // --- 2. Métricas Financeiras do Dia ---
    const metricasResult = await pool.query(
      `SELECT 
         COALESCE(SUM(valor), 0)::float as faturamento, 
         COUNT(id_pedido)::int as totalPedidos 
       FROM Pedido 
       WHERE 
         id_restaurante = $1 
         AND status = 'completo' 
         AND data_pedido >= CURRENT_DATE;`,
      [restauranteId]
    );
    const metricasHoje = metricasResult.rows[0];


    // --- 3. Itens com Estoque Baixo ---
    const estoqueResult = await pool.query(
      `SELECT id_prato, nome, estoque 
       FROM Lista_de_Pratos 
       WHERE id_restaurante = $1 AND estoque < 10
       ORDER BY estoque ASC LIMIT 5;`,
      [restauranteId]
    );
    const estoqueBaixo = estoqueResult.rows;


    // --- 4. Últimas Avaliações (AGORA ATIVADO) ---
    const avaliacoesResult = await pool.query(
        `SELECT 
           a.nota, a.comentarios AS comentario, c.nome AS nome_cliente
         FROM Avaliacoes a
         JOIN Cliente c ON a.id_cliente = c.id_cliente
         WHERE a.id_restaurante = $1
         ORDER BY a.data DESC LIMIT 3;`,
        [restauranteId]
    );
    const ultimasAvaliacoes = avaliacoesResult.rows;
    

    // --- Monta a Resposta Final ---
    const dashboardData = {
      contagemPedidos,
      metricasHoje,
      estoqueBaixo,
      ultimasAvaliacoes,
    };

    return res.status(200).json(dashboardData);

  } catch (e) {
    console.error("Erro ao buscar dados do dashboard:", e);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


export default router;

