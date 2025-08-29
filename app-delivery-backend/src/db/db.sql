DROP TABLE IF EXISTS Avaliacoes CASCADE;
DROP TABLE IF EXISTS Item_Pedido CASCADE;
DROP TABLE IF EXISTS Entrega CASCADE;
DROP TABLE IF EXISTS Hora_Funcionamente CASCADE;
DROP TABLE IF EXISTS Tipo_Culinaria_Restaurante CASCADE;
DROP TABLE IF EXISTS Lista_de_Pratos CASCADE;
DROP TABLE IF EXISTS Endereco_Cliente CASCADE;
DROP TABLE IF EXISTS Pedido CASCADE;
DROP TABLE IF EXISTS Categoria_Pratos CASCADE;
DROP TABLE IF EXISTS Tipo_Culinaria CASCADE;
DROP TABLE IF EXISTS Restaurante CASCADE;
DROP TABLE IF EXISTS Cliente CASCADE;
DROP TABLE IF EXISTS Usuario CASCADE;

DROP TYPE IF EXISTS enum_status_pedido CASCADE;
DROP TYPE IF EXISTS enum_formas_pagamento CASCADE;
DROP TYPE IF EXISTS enum_tipos_culinaria CASCADE;
DROP TYPE IF EXISTS enum_categoria_pratos CASCADE;

CREATE TYPE enum_status_pedido AS ENUM ('completo', 'em_preparacao', 'a_caminho', 'pedido_esperando_ser_aceito');
CREATE TYPE enum_formas_pagamento as ENUM ('pix', 'em_especie', 'credito', 'debito');
CREATE TYPE enum_tipos_culinaria as ENUM (
'generalista','italiana', 'churrascaria', 'cafeteria', 'lanchonete', 'japonesa', 'sobremesas');
CREATE TYPE enum_categoria_pratos as ENUM (
'combos', 'baratos', 'salgados', 'doces', 'frios', 'quentes');

CREATE TABLE Usuario (
    id_usuario SERIAL PRIMARY KEY,
    usuario VARCHAR(100) UNIQUE,
    email VARCHAR(100),
    senha VARCHAR(100),
    is_restaurante BOOLEAN
);

CREATE TABLE Cliente (
  id_cliente SERIAL PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100),
  senha VARCHAR(100),
  telefone VARCHAR(100),
  cpf CHAR(11) UNIQUE,
  id_usuario INT NOT NULL,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Restaurante (
    id_restaurante SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100),
    endereco VARCHAR(100),
    telefone VARCHAR(20),
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Tipo_Culinaria (
    id_tipo_culinaria SERIAL PRIMARY KEY,
    descricao enum_tipos_culinaria
);

CREATE TABLE Categoria_Pratos (
    id_categoria SERIAL PRIMARY KEY,
    descricao enum_categoria_pratos
);

CREATE TABLE Pedido (
    id_pedido SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_restaurante INT NOT NULL,
    data_pedido TIMESTAMP,
    status enum_status_pedido,
    forma_pagamento enum_formas_pagamento,
    valor INT CHECK (valor >= 0),
    taxa INT,
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente),
    FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante)
);

CREATE TABLE Endereco_Cliente (
    id_endereco SERIAL PRIMARY KEY,
    id_cliente INT NOT NULL,
    logradouro VARCHAR(200),
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado_siga CHAR(2),
    cep CHAR(8),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);

CREATE TABLE Lista_de_Pratos (
    id_prato SERIAL PRIMARY KEY,
    id_restaurante INT NOT NULL,
    nome VARCHAR(50),
    descricao VARCHAR(100),
    valor INT CHECK (valor >= 0),
    estoque INT CHECK (estoque >= 0),
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante),
    FOREIGN KEY (id_categoria) REFERENCES Categoria_Pratos(id_categoria)
);

CREATE TABLE Tipo_Culinaria_Restaurante (
    id_restaurante INT NOT NULL,
    id_tipo_culinaria INT NOT NULL,
    PRIMARY KEY (id_restaurante, id_tipo_culinaria),
    FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante),
    FOREIGN KEY (id_tipo_culinaria) REFERENCES Tipo_Culinaria(id_tipo_culinaria)
);

CREATE TABLE Hora_Funcionamente(
    id_horario SERIAL PRIMARY KEY,
    dia_da_semana VARCHAR(100),
    hora_abertura TIMESTAMP,
    hora_fechamento TIMESTAMP,
    id_restaurante INT NOT NULL,
    FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante)
);

CREATE TABLE Entrega (
    id_entrega SERIAL PRIMARY KEY,
    id_restaurante INT NOT NULL,
    id_pedido INT NOT NULL,
    id_endereco INT NOT NULL,
    FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante),
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (id_endereco) REFERENCES Endereco_Cliente(id_endereco)
);

CREATE TABLE Item_Pedido (
    id_item_pedido SERIAL PRIMARY KEY,
    id_prato INT NOT NULL,
    id_pedido INT NOT NULL,
    quantidade_item INT,
    infos_adicionais VARCHAR(100),
    preco_por_item INT,
    FOREIGN KEY (id_pedido) REFERENCES Pedido(id_pedido),
    FOREIGN KEY (id_prato) REFERENCES Lista_de_Pratos(id_prato)
);

CREATE TABLE Avaliacoes (
    avaliacao_id SERIAL PRIMARY KEY,
    comentarios VARCHAR(250),
    nota INT CHECK (nota >= 0 AND nota <= 5),
    data TIMESTAMP,
    id_restaurante INT NOT NULL,
    id_cliente INT NOT NULL,
    FOREIGN KEY (id_restaurante) REFERENCES Restaurante(id_restaurante),
    FOREIGN KEY (id_cliente) REFERENCES Cliente(id_cliente)
);
