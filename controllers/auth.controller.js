const { response } = require('express');
const bcryptjs = require('bcryptjs');

const { generarJWT } = require('../helpers/generarJWT');

const pool = require('../database/config');

const login = async (req, res = response) => {
  try {
    const { correo, passwordN } = req.body;
    const idUser = await pool.query(
      `SELECT * from f_read_email_user($1::character varying)`,
      [correo]
    );
    if (JSON.stringify(idUser.rows) === '[]') {
      return res
        .status(404)
        .send({ code: -1, msg: `No esta resgistrado este email: ${correo}` });
    }
    //verificar contrasena
    const validPassword = bcryptjs.compareSync(
      passwordN,
      idUser.rows[0].password
    );
    if (!validPassword) {
      return res.status(400).json({
        msg: 'Usuario / password no son correctos - password',
      });
    }

    //generar el JWT
    const token = await generarJWT(idUser.rows[0].id_user);

    res.status(200).json({
      code: 1,
      msg: 'Bienvenido!',
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'HABLE CON EL ADMINISTRADOR',
    });
  }
};

module.exports = { login };
