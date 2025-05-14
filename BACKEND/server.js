const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const carroRoutes = require('./routes/carroRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const orcamentoRoutes = require('./routes/orcamentoRoutes');

const app = express();

// 🔐 Libera acesso do front com CORS
app.use(cors());

// 🔄 Permite ler JSON no corpo das requisições
app.use(express.json());

// 🌐 Rota de login
app.use('/api/auth', authRoutes);

// 🌐 Rota de Consulta Cliente
app.use('/api', clienteRoutes);

// 🌐 Rota de Consulta Carros
app.use('/api', carroRoutes);

app.use('/api', produtoRoutes);

app.use('/api', orcamentoRoutes);

app.use(express.static(path.join(__dirname, 'FRONTEND')));

// 🚀 Inicializa o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend rodando em http://localhost:${PORT}`);
});