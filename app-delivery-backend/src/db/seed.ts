import pool from './pool';
import bcrypt from 'bcrypt';

async function seedDatabase() {
  const client = await pool.connect();

  try {
    console.log('Starting database seeding...');

    // Begin transaction
    await client.query('BEGIN');

    // 1. Seed Usuarios
    console.log('Seeding usuarios...');
    const usuarios = [
      { usuario: 'joao123', email: 'joao@email.com', senha: await bcrypt.hash('senha123', 10), is_restaurante: false },
      { usuario: 'maria456', email: 'maria@email.com', senha: await bcrypt.hash('senha456', 10), is_restaurante: false },
      { usuario: 'pizza_palace', email: 'contato@pizzapalace.com', senha: await bcrypt.hash('resto123', 10), is_restaurante: true },
      { usuario: 'burger_king', email: 'admin@burgerking.com', senha: await bcrypt.hash('resto456', 10), is_restaurante: true },
      { usuario: 'sushi_zen', email: 'info@sushizen.com', senha: await bcrypt.hash('resto789', 10), is_restaurante: true },
      { usuario: 'ana789', email: 'ana@email.com', senha: await bcrypt.hash('senha789', 10), is_restaurante: false },
    ];

    for (const usuario of usuarios) {
      await client.query(
        'INSERT INTO Usuario (usuario, email, senha, is_restaurante) VALUES ($1, $2, $3, $4)',
        [usuario.usuario, usuario.email, usuario.senha, usuario.is_restaurante]
      );
    }

    // 2. Seed Clientes
    console.log('Seeding clientes...');
    const clientes = [
      { nome: 'João Silva', email: 'joao@email.com', senha: await bcrypt.hash('senha123', 10), telefone: '11999887766', cpf: '12345678901', id_usuario: 1 },
      { nome: 'Maria Santos', email: 'maria@email.com', senha: await bcrypt.hash('senha456', 10), telefone: '11988776655', cpf: '12345678902', id_usuario: 2 },
      { nome: 'Ana Costa', email: 'ana@email.com', senha: await bcrypt.hash('senha789', 10), telefone: '11977665544', cpf: '12345678903', id_usuario: 6 },
    ];

    for (const cliente of clientes) {
      await client.query(
        'INSERT INTO Cliente (nome, email, senha, telefone, cpf, id_usuario) VALUES ($1, $2, $3, $4, $5, $6)',
        [cliente.nome, cliente.email, cliente.senha, cliente.telefone, cliente.cpf, cliente.id_usuario]
      );
    }

    // 3. Seed Restaurantes
    console.log('Seeding restaurantes...');
    const restaurantes = [
      { nome: 'Pizza Palace', email: 'contato@pizzapalace.com', endereco: 'Rua das Pizzas, 123', telefone: '11444555666', id_usuario: 3 },
      { nome: 'Burger King', email: 'admin@burgerking.com', endereco: 'Av. dos Hambúrgueres, 456', telefone: '11333444555', id_usuario: 4 },
      { nome: 'Sushi Zen', email: 'info@sushizen.com', endereco: 'Rua do Sushi, 789', telefone: '11222333444', id_usuario: 5 },
    ];

    for (const restaurante of restaurantes) {
      await client.query(
        'INSERT INTO Restaurante (nome, email, endereco, telefone, id_usuario) VALUES ($1, $2, $3, $4, $5)',
        [restaurante.nome, restaurante.email, restaurante.endereco, restaurante.telefone, restaurante.id_usuario]
      );
    }

    // 4. Seed Tipo_Culinaria
    console.log('Seeding tipos de culinária...');
    const tiposCulinaria = [
      'generalista', 'italiana', 'churrascaria', 'cafeteria', 'lanchonete', 'japonesa', 'sobremesas'
    ];

    for (const tipo of tiposCulinaria) {
      await client.query(
        'INSERT INTO Tipo_Culinaria (descricao) VALUES ($1)',
        [tipo]
      );
    }

    // 5. Seed Categoria_Pratos
    console.log('Seeding categorias de pratos...');
    const categoriasPratos = [
      'combos', 'baratos', 'salgados', 'doces', 'frios', 'quentes'
    ];

    for (const categoria of categoriasPratos) {
      await client.query(
        'INSERT INTO Categoria_Pratos (descricao) VALUES ($1)',
        [categoria]
      );
    }

    // 6. Seed Endereco_Cliente
    console.log('Seeding endereços dos clientes...');
    const enderecos = [
      { id_cliente: 1, logradouro: 'Rua A', numero: '100', bairro: 'Centro', cidade: 'São Paulo', estado_siga: 'SP', cep: '01000000' },
      { id_cliente: 1, logradouro: 'Rua B', numero: '200', bairro: 'Jardim', cidade: 'São Paulo', estado_siga: 'SP', cep: '02000000' },
      { id_cliente: 2, logradouro: 'Av. C', numero: '300', bairro: 'Vila Nova', cidade: 'São Paulo', estado_siga: 'SP', cep: '03000000' },
      { id_cliente: 3, logradouro: 'Rua D', numero: '400', bairro: 'Bela Vista', cidade: 'São Paulo', estado_siga: 'SP', cep: '04000000' },
    ];

    for (const endereco of enderecos) {
      await client.query(
        'INSERT INTO Endereco_Cliente (id_cliente, logradouro, numero, bairro, cidade, estado_siga, cep) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [endereco.id_cliente, endereco.logradouro, endereco.numero, endereco.bairro, endereco.cidade, endereco.estado_siga, endereco.cep]
      );
    }

    // 7. Seed Tipo_Culinaria_Restaurante
    console.log('Seeding tipos de culinária dos restaurantes...');
    const tiposCulinariaRestaurante = [
      { id_restaurante: 1, id_tipo_culinaria: 2 }, // Pizza Palace - italiana
      { id_restaurante: 2, id_tipo_culinaria: 5 }, // Burger King - lanchonete
      { id_restaurante: 3, id_tipo_culinaria: 6 }, // Sushi Zen - japonesa
    ];

    for (const tipo of tiposCulinariaRestaurante) {
      await client.query(
        'INSERT INTO Tipo_Culinaria_Restaurante (id_restaurante, id_tipo_culinaria) VALUES ($1, $2)',
        [tipo.id_restaurante, tipo.id_tipo_culinaria]
      );
    }

    // 8. Seed Lista_de_Pratos
    console.log('Seeding lista de pratos...');
    const pratos = [
      // Pizza Palace
      { id_restaurante: 1, nome: 'Pizza Margherita', descricao: 'Pizza tradicional com molho de tomate, mussarela e manjericão', valor: 3500, estoque: 50, id_categoria: 6 },
      { id_restaurante: 1, nome: 'Pizza Pepperoni', descricao: 'Pizza com pepperoni e queijo mussarela', valor: 4000, estoque: 30, id_categoria: 6 },
      { id_restaurante: 1, nome: 'Combo Pizza + Refri', descricao: 'Pizza média + refrigerante 2L', valor: 4500, estoque: 20, id_categoria: 1 },

      // Burger King
      { id_restaurante: 2, nome: 'Whopper', descricao: 'Hambúrguer com carne grelhada, alface, tomate, cebola e maionese', valor: 2500, estoque: 100, id_categoria: 3 },
      { id_restaurante: 2, nome: 'Big King', descricao: 'Hambúrguer duplo com queijo e molho especial', valor: 3000, estoque: 80, id_categoria: 3 },
      { id_restaurante: 2, nome: 'Combo Whopper', descricao: 'Whopper + batata + refri', valor: 3500, estoque: 60, id_categoria: 1 },

      // Sushi Zen
      { id_restaurante: 3, nome: 'Combo Sashimi', descricao: 'Seleção de sashimis frescos', valor: 5500, estoque: 25, id_categoria: 5 },
      { id_restaurante: 3, nome: 'Temaki Salmão', descricao: 'Cone de alga com arroz, salmão e pepino', valor: 1800, estoque: 40, id_categoria: 5 },
      { id_restaurante: 3, nome: 'Hot Roll', descricao: 'Uramaki empanado e frito', valor: 2200, estoque: 35, id_categoria: 6 },
    ];

    for (const prato of pratos) {
      await client.query(
        'INSERT INTO Lista_de_Pratos (id_restaurante, nome, descricao, valor, estoque, id_categoria) VALUES ($1, $2, $3, $4, $5, $6)',
        [prato.id_restaurante, prato.nome, prato.descricao, prato.valor, prato.estoque, prato.id_categoria]
      );
    }

    // 9. Seed Hora_Funcionamente
    console.log('Seeding horários de funcionamento...');
    const horarios = [
      // Pizza Palace
      { dia_da_semana: 'Segunda-feira', hora_abertura: '2024-01-01 18:00:00', hora_fechamento: '2024-01-01 23:00:00', id_restaurante: 1 },
      { dia_da_semana: 'Terça-feira', hora_abertura: '2024-01-01 18:00:00', hora_fechamento: '2024-01-01 23:00:00', id_restaurante: 1 },

      // Burger King
      { dia_da_semana: 'Segunda-feira', hora_abertura: '2024-01-01 10:00:00', hora_fechamento: '2024-01-01 22:00:00', id_restaurante: 2 },
      { dia_da_semana: 'Domingo', hora_abertura: '2024-01-01 11:00:00', hora_fechamento: '2024-01-01 21:00:00', id_restaurante: 2 },

      // Sushi Zen
      { dia_da_semana: 'Terça-feira', hora_abertura: '2024-01-01 17:00:00', hora_fechamento: '2024-01-01 23:30:00', id_restaurante: 3 },
      { dia_da_semana: 'Sexta-feira', hora_abertura: '2024-01-01 17:00:00', hora_fechamento: '2024-01-02 00:30:00', id_restaurante: 3 },
    ];

    for (const horario of horarios) {
      await client.query(
        'INSERT INTO Hora_Funcionamente (dia_da_semana, hora_abertura, hora_fechamento, id_restaurante) VALUES ($1, $2, $3, $4)',
        [horario.dia_da_semana, horario.hora_abertura, horario.hora_fechamento, horario.id_restaurante]
      );
    }

    // 10. Seed Pedidos
    console.log('Seeding pedidos...');
    const pedidos = [
      { id_cliente: 1, id_restaurante: 1, data_pedido: '2024-01-15 19:30:00', status: 'completo', forma_pagamento: 'pix', valor: 4500, taxa: 300 },
      { id_cliente: 2, id_restaurante: 2, data_pedido: '2024-01-16 12:15:00', status: 'em_preparacao', forma_pagamento: 'credito', valor: 3500, taxa: 250 },
      { id_cliente: 3, id_restaurante: 3, data_pedido: '2024-01-17 20:00:00', status: 'a_caminho', forma_pagamento: 'debito', valor: 5500, taxa: 400 },
      { id_cliente: 1, id_restaurante: 2, data_pedido: '2024-01-18 13:30:00', status: 'pedido_esperando_ser_aceito', forma_pagamento: 'pix', valor: 2500, taxa: 200 },
    ];

    for (const pedido of pedidos) {
      await client.query(
        'INSERT INTO Pedido (id_cliente, id_restaurante, data_pedido, status, forma_pagamento, valor, taxa) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [pedido.id_cliente, pedido.id_restaurante, pedido.data_pedido, pedido.status, pedido.forma_pagamento, pedido.valor, pedido.taxa]
      );
    }

    // 11. Seed Item_Pedido
    console.log('Seeding itens dos pedidos...');
    const itensPedido = [
      // Pedido 1 (Pizza Palace)
      { id_prato: 3, id_pedido: 1, quantidade_item: 1, infos_adicionais: 'Sem cebola', preco_por_item: 4500 },

      // Pedido 2 (Burger King)
      { id_prato: 6, id_pedido: 2, quantidade_item: 1, infos_adicionais: '', preco_por_item: 3500 },

      // Pedido 3 (Sushi Zen)
      { id_prato: 7, id_pedido: 3, quantidade_item: 1, infos_adicionais: 'Sem wasabi', preco_por_item: 5500 },

      // Pedido 4 (Burger King)
      { id_prato: 4, id_pedido: 4, quantidade_item: 1, infos_adicionais: 'Ponto da carne bem passado', preco_por_item: 2500 },
    ];

    for (const item of itensPedido) {
      await client.query(
        'INSERT INTO Item_Pedido (id_prato, id_pedido, quantidade_item, infos_adicionais, preco_por_item) VALUES ($1, $2, $3, $4, $5)',
        [item.id_prato, item.id_pedido, item.quantidade_item, item.infos_adicionais, item.preco_por_item]
      );
    }

    // 12. Seed Entrega
    console.log('Seeding entregas...');
    const entregas = [
      { id_restaurante: 1, id_pedido: 1, id_endereco: 1 },
      { id_restaurante: 2, id_pedido: 2, id_endereco: 3 },
      { id_restaurante: 3, id_pedido: 3, id_endereco: 4 },
      { id_restaurante: 2, id_pedido: 4, id_endereco: 2 },
    ];

    for (const entrega of entregas) {
      await client.query(
        'INSERT INTO Entrega (id_restaurante, id_pedido, id_endereco) VALUES ($1, $2, $3)',
        [entrega.id_restaurante, entrega.id_pedido, entrega.id_endereco]
      );
    }

    // 13. Seed Avaliacoes
    console.log('Seeding avaliações...');
    const avaliacoes = [
      { comentarios: 'Pizza deliciosa, chegou quentinha!', nota: 5, data: '2024-01-15 21:00:00', id_restaurante: 1, id_cliente: 1 },
      { comentarios: 'Hambúrguer bom, mas demorou um pouco', nota: 4, data: '2024-01-17 21:30:00', id_restaurante: 3, id_cliente: 3 },
      { comentarios: 'Sushi fresco e de qualidade', nota: 5, data: '2024-01-17 21:30:00', id_restaurante: 3, id_cliente: 3 },
    ];

    for (const avaliacao of avaliacoes) {
      await client.query(
        'INSERT INTO Avaliacoes (comentarios, nota, data, id_restaurante, id_cliente) VALUES ($1, $2, $3, $4, $5)',
        [avaliacao.comentarios, avaliacao.nota, avaliacao.data, avaliacao.id_restaurante, avaliacao.id_cliente]
      );
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Database seeding complete!');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedDatabase();
