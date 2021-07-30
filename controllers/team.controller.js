const { response, request } = require('express');
const pool = require('../database/config');

const teamsGet = async (req = request, res = response) => {
  try {
    let respuesta = await pool.query(`SELECT * from public.t_team`);
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (JSON.stringify(respuesta.rows) === '[]') {
      return res.status(404).send({ code: -1, msg: 'No hay equipos' });
    } else {
      equipos = respuesta.rows;
      res.status(200).json({ code: 1, msg: 'Equipos', equipos });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->SELECT * from t_team\n ${error}`);
  }
};

const teamGet = async (req = request, res = response) => {
  try {
    const { id_team } = req.body;
    let respuesta = await pool.query(
      `SELECT * from f_readt_team_id($1::numeric)`,
      [id_team]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (JSON.stringify(respuesta.rows) === '[]') {
      return res
        .status(404)
        .send({ code: -1, msg: 'No hay equipo con ese ID' });
    } else {
      equipos = respuesta.rows[0];
      res.status(200).json({ code: 1, msg: 'Equipo', equipos });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->f_readt_team()\n ${error}`);
  }
};

const teamPost = async (req = request, res = response) => {
  try {
    const { name, league, country } = req.body;
    let respuesta = await pool.query(
      `SELECT * from public.f_createt_team($1::character varying,$2::character varying,$3::character varying)`,
      [name, league, country]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      respuesta_error = respuesta.rows;
      return res.status(404).send({ respuesta_error });
    } else {
      equipos = respuesta.rows[0];
      res.status(200).json({ equipos });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->public.f_createt_team\n ${error}`);
  }
};

const teamPut = async (req = request, res = response) => {
  try {
    const { id_team, name, league, country } = req.body;
    let respuesta = await pool.query(
      `SELECT * from public.f_updatet_team($1::numeric,$2::character varying,$3::character varying,$4::character varying)`,
      [id_team, name, league, country]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      respuesta_error = respuesta.rows;
      return res.status(404).send({ respuesta_error });
    } else {
      equipos = respuesta.rows[0];
      res.status(200).json({ equipos });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->public.f_updatet_team\n ${error}`);
  }
};

const teamDelete = async (req = request, res = response) => {
  try {
    const { id_team } = req.body;
    let respuesta = await pool.query(
      `SELECT * from f_deletet_team($1::numeric)`,
      [id_team]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      respuesta_error = respuesta.rows;
      return res.status(404).send({ respuesta_error });
    } else {
      equipos = respuesta.rows[0];
      res.status(200).json({ equipos });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->f_deletet_team()\n ${error}`);
  }
};

module.exports = {
  teamDelete,
  teamsGet,
  teamGet,
  teamPost,
  teamPut,
};
