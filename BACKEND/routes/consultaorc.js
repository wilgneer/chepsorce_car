const express = require('express');
const router = express.Router();
const path = require('path');
const pool = require('../db/connection');

// 📄 Rota para servir a página HTML
router.get('/consulta-orcamento', (req, res) => {
  res.sendFile(path.join(__dirname, '../../FRONTEND/consulta_orc/consulta_orc.html'));
});

// 🔍 Rota para listar orçamentos
router.get('/orcamentos', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        o.idorcamento AS nrorcamento,
        c.nome,
        c.email,
        ca.nmmodelo,
        ca.placa,
        o.dtorcamento AS dtorcamento
      FROM orcamento o
      LEFT JOIN cliente c ON o.idcliente = c.idcliente
      LEFT JOIN carros ca ON o.idcarro = ca.idcarro
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao consultar orçamentos' });
  }
});

// 📋 Rota para buscar detalhes de um orçamento
router.get('/orcamentos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const orcamento = await pool.query('SELECT * FROM orcamento WHERE idorcamento = $1', [id]);
    const cliente = await pool.query('SELECT * FROM cliente WHERE idcliente = $1', [orcamento.rows[0].idcliente]);
    const carro = await pool.query('SELECT * FROM carros WHERE idcarro = $1', [orcamento.rows[0].idcarro]);
    const empresa = await pool.query('SELECT * FROM empresa WHERE idempresa = $1', [orcamento.rows[0].idempresa]);
    const itens = await pool.query(`
      SELECT io.*, p.nmproduto, p.unidadedemedida
      FROM itensorcamento io
      JOIN produto p ON p.idproduto = io.idproduto
      WHERE io.idorcamento = $1
    `, [id]);

    res.json({
      orcamento: orcamento.rows[0],
      cliente: cliente.rows[0],
      carro: carro.rows[0],
      empresa: empresa.rows[0],
      itens: itens.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar detalhes do orçamento' });
  }
});

module.exports = router;
