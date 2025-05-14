const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Salvar orçamento + itens
router.post('/orcamento', async (req, res) => {
  const { cpfcliente, placacarro, observacoes, produtos } = req.body;

  try {
    const clienteQuery = await pool.query('SELECT idcliente FROM cliente WHERE cpf = $1', [cpfcliente]);
    const carroQuery = await pool.query('SELECT idcarro FROM carros WHERE placa = $1', [placacarro]);

    const idcliente = clienteQuery.rows[0]?.idcliente;
    const idcarro = carroQuery.rows[0]?.idcarro;

    if (!idcliente || !idcarro) {
      return res.status(400).json({ message: 'Cliente ou carro não encontrado.' });
    }

    // Criar protocolo
    const protocoloResult = await pool.query(
      'INSERT INTO protocolo(nrprotocolo, dtcriacao) VALUES($1, CURRENT_DATE) RETURNING idprotocolo',
      [Math.floor(100000 + Math.random() * 900000).toString()]
    );
    const idprotocolo = protocoloResult.rows[0].idprotocolo;

    // Criar orçamento
    const orcamentoResult = await pool.query(
      `INSERT INTO orcamento (idprotocolo, idcarro, idempresa, idcliente, nrorcamento, dtorcamento, requisicao, observacao)
       VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, false, $6)
       RETURNING idorcamento`,
      [idprotocolo, idcarro, 1, idcliente, Math.floor(100000 + Math.random() * 900000).toString(), observacoes]
    );
    const idorcamento = orcamentoResult.rows[0].idorcamento;

    // Inserir os itens
    for (const produto of produtos) {
      const produtoQuery = await pool.query(
        'SELECT idproduto FROM produto WHERE nmproduto = $1',
        [produto.descricao]
      );
      const idproduto = produtoQuery.rows[0]?.idproduto;

      if (!idproduto) continue;

      await pool.query(
        `INSERT INTO itensorcamento (idorcamento, idproduto, qtdproduto, valorunitario)
         VALUES ($1, $2, $3, $4)`,
        [idorcamento, idproduto, produto.quantidade, produto.valor]
      );
    }

    res.status(201).json({ message: 'Orçamento e itens salvos com sucesso!' });

  } catch (error) {
    console.error('Erro ao salvar orçamento:', error);
    res.status(500).json({ message: 'Erro ao salvar orçamento' });
  }
});

module.exports = router;