const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Teste de conexão
pool.connect()
  .then(client => {
    console.log('✅ Conectado ao banco de dados PostgreSQL com sucesso!');
    client.release(); // libera o cliente de volta para o pool
  })
  .catch(err => {
    console.error('❌ Erro ao conectar no banco de dados:', err.message);
  });

module.exports = pool;