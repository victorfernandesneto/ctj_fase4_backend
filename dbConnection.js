// db_connection.js

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

module.exports = { connectDatabase, disconnectDatabase, client };