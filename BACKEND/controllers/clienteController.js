// controllers/clienteController.js
const db = require('../db/connection');

exports.buscarClientes = async (req, res) => {
  const termo = req.query.busca;

  if (!termo) {
    return res.status(400).json({ erro: 'Parâmetro de busca é obrigatório.' });
  }

  try {
    const query = `
  SELECT idcliente, nome, cpf
  FROM cliente
  WHERE unaccent(cpf) ILIKE unaccent($1) OR unaccent(nome) ILIKE unaccent($1)
  LIMIT 10
`;
    const result = await db.query(query, ['%' + termo + '%']);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ erro: 'Erro ao buscar clientes', detalhe: error.message });
  }
};
