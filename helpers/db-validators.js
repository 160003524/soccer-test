const pool = require('../database/config');

//verificar si correo existe
const emailExist = async (email = '') => {
  const existEmail = await pool.query(
    `SELECT email from f_read_email_user($1::character varying)`,
    [email]
  );
  if (!(JSON.stringify(existEmail.rows) === '[]')) {
    throw new Error(`El correo ${email} ya existe en la base de datos`);
  }
};

const teamExist = async (id_team = '') => {
  const teamExist = await pool.query(
    `SELECT * from f_readt_team_id($1::numeric)`,
    [id_team]
  );
  if (JSON.stringify(teamExist.rows) === '[]') {
    throw new Error(`El equipo ${id_team} no existe`);
  }
};

const playerExist = async (id_player = '') => {
  const playerExist = await pool.query(
    `SELECT * from f_readt_player_id($1::numeric)`,
    [id_player]
  );
  if (JSON.stringify(playerExist.rows) === '[]') {
    throw new Error(`El player ${id_player} no existe`);
  }
};

module.exports = { emailExist, teamExist, playerExist };
