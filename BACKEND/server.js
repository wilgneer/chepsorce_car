const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const carroRoutes = require('./routes/carroRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const orcamentoRoutes = require('./routes/orcamentoRoutes');
const consultaOrcRouter = require('./routes/consultaorc');

const app = express();

// 🔐 Libera acesso do front com CORS
app.use(cors());

// 🔄 Permite leitura de JSON
app.use(express.json());

// ✅ SERVINDO TODAS AS PASTAS DO FRONTEND
app.use('/menu', express.static(path.join(__dirname, '../FRONTEND/menu')));
app.use('/consulta_orc', express.static(path.join(__dirname, '../FRONTEND/consulta_orc')));
app.use('/novo_orc', express.static(path.join(__dirname, '../FRONTEND/novo_orc')));
app.use('/login', express.static(path.join(__dirname, '../FRONTEND/login')));
app.use('/consulta_cliente', express.static(path.join(__dirname, '../FRONTEND/consulta_cliente')));
app.use('/icons', express.static(path.join(__dirname, '../FRONTEND/icons')));
app.use('/configuracoes', express.static(path.join(__dirname, '../FRONTEND/configuracoes')));

// ✅ ROTAS BACKEND
app.use('/api/auth', authRoutes);
app.use('/api', clienteRoutes);
app.use('/api', carroRoutes);
app.use('/api', produtoRoutes);
app.use('/api', orcamentoRoutes);
app.use('/', consultaOrcRouter); // inclui /consulta-orcamento

// ✅ PORTA
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em: http://localhost:${PORT}`);
});