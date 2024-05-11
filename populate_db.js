require('dotenv').config();
const { Client } = require('pg');

// Configurações de conexão com o banco de dados
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

//Função para conectar-se ao banco de dados
async function connectDatabase() {
    try{
        await client.connect();
    } catch (error){
        console.error('Erro ao se conectar à database:', error);
    }
}

//Função para desconectar-se ao banco de dados
async function disconnectDatabase() {
    try{
        await client.end();
    } catch (error){
        console.error('Erro ao se desconectar da database:', error);
    }
}

// Função para criar as tabelas
async function createTables() {
  try {
    // Query para criar a tabela de espaços
    await client.query(`
      CREATE TABLE IF NOT EXISTS espacos (
        id SERIAL PRIMARY KEY,
        nome_do_espaco VARCHAR(255) UNIQUE NOT NULL,
        capacidade INT NOT NULL
      )
    `);

    // Query para criar a tabela de reservas
    await client.query(`
      CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        inicio_da_reserva TIMESTAMP NOT NULL,
        fim_da_reserva TIMESTAMP NOT NULL,
        id_espaco INT NOT NULL,
        FOREIGN KEY (id_espaco) REFERENCES espacos(id)
      )
    `);

    console.log('Tabelas criadas com sucesso!');
  } catch (error) {
    console.error('Erro ao criar as tabelas:', error);
  }
}

// Função para inserir dados iniciais
async function insertInitialData() {
  try {
    // Inserir espaços fake
    await client.query(`
      INSERT INTO espacos (nome_do_espaco, capacidade) VALUES 
      ('Espaco A', 50),
      ('Espaco B', 30)
    `);

    console.log('Dados iniciais inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir dados iniciais:', error);
  }
}

// Chamar as funções para criar as tabelas e inserir os dados
connectDatabase()
    .then(createTables)
    // .then(insertInitialData)
    .then(disconnectDatabase)
    .catch(error => console.error('Erro:', error));