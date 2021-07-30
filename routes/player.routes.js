const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleswares/validar-campos');
const { validarJWT } = require('../middleswares/validar-jwt');

const { playerExist, teamExist } = require('../helpers/db-validators');
const {
  playerDelete,
  playersGet,
  playerGet,
  playerPost,
  playerPut,
  playerSearch,
} = require('../controllers/player.controller');

const router = Router();
router.get('/', validarJWT, playersGet);

router.get(
  '/pla',
  [
    validarJWT,
    check('id_player', 'El id_player es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  playerGet
);

router.post(
  '/',
  [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('age', 'La edad es obligatoria').not().isEmpty(),
    check('team_id', 'El id del equipo es obligatorio').not().isEmpty(),
    check('team_id').custom(teamExist),
    check('squad_number', 'El numero de posicion es obligatorio')
      .not()
      .isEmpty(),
    check('position', 'La posicion es obligatoria es obligatorio')
      .not()
      .isEmpty(),
    check('nationality', 'La nacionalidad es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  playerPost
);

router.post('/search', playerSearch);

router.put(
  '/',
  [
    validarJWT,
    check('id_player', 'El id_player es obligatorio').not().isEmpty(),
    check('team_id', 'El id del equipo es obligatorio').not().isEmpty(),
    check('team_id').custom(teamExist),
    check('id_player').custom(playerExist),
    validarCampos,
  ],
  playerPut
);

router.delete(
  '/',
  [
    validarJWT,
    check('id_player', 'El id_player es obligatorio').not().isEmpty(),
    check('id_player').custom(playerExist),
    validarCampos,
  ],
  playerDelete
);

module.exports = router;
