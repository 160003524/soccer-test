const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const pool = require('../database/config');

const userPost = async (req = request, res = response) => {
  try {
    const { correo, passwordN } = req.body;
    //encriptar contrasena
    const salt = bcryptjs.genSaltSync();
    const password = bcryptjs.hashSync(passwordN, salt);
    let respuesta = await pool.query(
      `SELECT * from f_createt_user($1::character varying,$2::character varying)`,
      [correo, password]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      return res
        .status(404)
        .send({ code: -1, msg: 'No se pudo crear el usuario' });
    } else {
      insert = respuesta.rows;
      res.status(200).json({ insert });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`user.controller.js->createT_user()\n ${error}`);
  }
};

module.exports = {
  userPost,
};
