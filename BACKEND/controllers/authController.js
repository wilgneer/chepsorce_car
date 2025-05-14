// Linha 1 – Importa a conexão com o banco
const db = require('../db/connection');

// Linha 3 – Função de login
exports.login = async (req, res) => {
  // Linha 4 – Captura os dados recebidos do frontend
  const { cdusuario, cdpassword } = req.body;

  // ✅ Linha 6 – Debug: mostra o corpo da requisição no terminal
  console.log('🔎 Recebido no login:', req.body);

  // Linha 8 – Verifica se os dados vieram preenchidos
  if (!cdusuario || !cdpassword) {
    return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
  }

  try {
    // Linha 13 – Busca o usuário no banco de dados
    const result = await db.query(
      'SELECT * FROM usuario WHERE cdusuario = $1 AND cdativo = true',
      [cdusuario]
    );

    // Linha 18 – Se existir, pega o usuário
    const usuario = result.rows[0];

    // Linha 20 – Verifica se encontrou e se a senha confere
    if (!usuario || usuario.cdpassword !== cdpassword) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    // Linha 25 – Retorna os dados do usuário logado
    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      usuario: {
        id: usuario.idusuario,
        nome: usuario.nmusuario,
        username: usuario.nmusername
      }
    });

  } catch (err) {
    // Linha 34 – Captura e retorna erros internos
    res.status(500).json({ erro: 'Erro interno', detalhe: err.message });
  }
};
