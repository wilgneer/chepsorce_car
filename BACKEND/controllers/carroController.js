const db = require('../db/connection');

exports.buscarCarros = async (req, res) => {
  const termo = req.query.busca;

  if (!termo) {
    return res.status(400).json({ erro: 'Parâmetro de busca é obrigatório.' });
  }

  try {
    const result = await db.query(`
      SELECT idcarro, nmmodelo, marca, cor, ano, placa
      FROM carros
      WHERE placa ILIKE $1
      ORDER BY placa
      LIMIT 10
    `, ['%' + termo + '%']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar carros', detalhe: error.message });
  }
};