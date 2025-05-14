const db = require('../db/connection');

async function buscarUsuario(cdusuario) {
  const result = await db.query(
    'SELECT * FROM usuario WHERE cdusuario = $1 AND cdativo = true',
    [cdusuario]
  );
  return result.rows[0];
}

module.exports = { buscarUsuario };