const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleswares/validar-campos');
const { validarJWT } = require('../middleswares/validar-jwt');

const { teamExist } = require('../helpers/db-validators');
const {
  teamDelete,
  teamsGet,
  teamGet,
  teamPost,
  teamPut,
} = require('../controllers/team.controller');

const router = Router();
router.get('/', validarJWT, teamsGet);

router.get(
  '/equipo',
  [
    validarJWT,
    check('id_team', 'El id_team es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  teamGet
);

router.post(
  '/',
  [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('league', 'La liga es obligatoria').not().isEmpty(),
    check('country', 'El pais es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  teamPost
);

router.put(
  '/',
  [
    validarJWT,
    check('id_team', 'El id_team es obligatorio').not().isEmpty(),
    check('id_team').custom(teamExist),
    validarCampos,
  ],
  teamPut
);

router.delete(
  '/',
  [
    validarJWT,
    check('id_team', 'El id_team es obligatorio').not().isEmpty(),
    check('id_team').custom(teamExist),
    validarCampos,
  ],
  teamDelete
);

module.exports = router;
