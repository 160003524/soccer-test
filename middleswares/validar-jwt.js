const { response, request } = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../database/config');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).json({
      msg: 'No hay token en la peticion',
    });
  }
  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    // leer el usuario que coorresponde el uid
    const idUser = await pool.query(
      `SELECT id_user from f_readt_user_id($1::numeric)`,
      [uid]
    );
    if (JSON.stringify(idUser.rows) === '[]') {
      return res.status(401).json({
        msg: 'Token no valido - usuario  no existe BD',
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: ' Token no valido',
    });
  }
};

module.exports = { validarJWT };
