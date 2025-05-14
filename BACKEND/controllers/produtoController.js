const db = require('../db/connection');

exports.buscarProdutos = async (req, res) => {
  const termo = req.query.busca;

  if (!termo) {
    return res.status(400).json({ erro: 'Parâmetro de busca é obrigatório.' });
  }

  try {
    const result = await db.query(`
      SELECT idproduto, nmproduto, unidadedemedida, valor
      FROM produto
      WHERE nmproduto ILIKE $1
      ORDER BY nmproduto
      LIMIT 10
    `, ['%' + termo + '%']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar produtos', detalhe: error.message });
  }
};