const { response, request } = require('express');
const pool = require('../database/config');

const playersGet = async (req = request, res = response) => {
  try {
    let respuesta = await pool.query(`SELECT * from public.t_player`);
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (JSON.stringify(respuesta.rows) === '[]') {
      return res.status(404).send({ code: -1, msg: 'No hay jugadores' });
    } else {
      players = respuesta.rows;
      res.status(200).json({ code: 1, msg: 'Jugadores', players });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`player.controller.js->SELECT * from t_player\n ${error}`);
  }
};

const playerGet = async (req = request, res = response) => {
  try {
    const { id_player } = req.body;
    let respuesta = await pool.query(
      `SELECT * from f_readt_player_id($1::numeric)`,
      [id_player]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (JSON.stringify(respuesta.rows) === '[]') {
      return res
        .status(404)
        .send({ code: -1, msg: 'No hay jugadores con ese ID' });
    } else {
      player = respuesta.rows[0];
      res.status(200).json({ code: 1, msg: 'Jugador', player });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->f_readt_team()\n ${error}`);
  }
};

const playerPost = async (req = request, res = response) => {
  try {
    const { name, age, team_id, squad_number, position, nationality } =
      req.body;
    let respuesta = await pool.query(
      `SELECT * from public.f_createt_player($1::character varying,$2::integer,$3::integer,$4::integer,$5::character varying,$6::character varying)`,
      [name, age, team_id, squad_number, position, nationality]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      respuesta_error = respuesta.rows;
      return res.status(404).send({ respuesta_error });
    } else {
      player = respuesta.rows[0];
      res.status(200).json({ player });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`player.controller.js->public.f_createt_player\n ${error}`);
  }
};

const playerPut = async (req = request, res = response) => {
  try {
    const {
      id_player,
      name,
      age,
      team_id,
      squad_number,
      position,
      nationality,
    } = req.body;
    let respuesta = await pool.query(
      `SELECT * from public.f_updatet_player($1::numeric,$2::character varying,$3::integer,$4::integer,$5::integer,$6::character varying,$7::character varying)`,
      [id_player, name, age, team_id, squad_number, position, nationality]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      respuesta_error = respuesta.rows;
      return res.status(404).send({ respuesta_error });
    } else {
      player = respuesta.rows[0];
      res.status(200).json({ player });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`player.controller.js->public.f_updatet_player\n ${error}`);
  }
};

const playerDelete = async (req = request, res = response) => {
  try {
    const { id_player } = req.body;
    let respuesta = await pool.query(
      `SELECT * from f_deletet_player($1::numeric)`,
      [id_player]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (respuesta.rows[0].rest != 1) {
      respuesta_error = respuesta.rows;
      return res.status(404).send({ respuesta_error });
    } else {
      player = respuesta.rows[0];
      res.status(200).json({ player });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`player.controller.js->f_deletet_player()\n ${error}`);
  }
};

const playerSearch = async (req = request, res = response) => {
  try {
    const { nationality, position } = req.query;
    let respuesta = await pool.query(
      `SELECT * from f_search_query_player($1::character varying,$2::character varying)`,
      [position, nationality]
    );
    /**Para verificar que el resultado de la consulta no arroja ningún registro
     * se convierte la respuesta en un JSONArray y se compara con []
     */
    if (JSON.stringify(respuesta.rows) === '[]') {
      return res
        .status(404)
        .send({ code: -1, msg: 'No hay jugadores con ese ID' });
    } else {
      player = respuesta.rows;
      res.status(200).json({ code: 1, msg: 'Jugador', player });
    }
  } catch (error) {
    console.log(error);
    throw new Error(`team.controller.js->f_readt_team()\n ${error}`);
  }
};
module.exports = {
  playerDelete,
  playersGet,
  playerGet,
  playerPost,
  playerPut,
  playerSearch,
};
