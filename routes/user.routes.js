const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middleswares/validar-campos');

const { emailExist } = require('../helpers/db-validators');

const { userPost } = require('../controllers/user.controller');

const router = Router();

router.post(
  '/',
  [
    check('passwordN', 'El password debe de ser mas de 6 letras').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es valido').isEmail(),
    check('correo').custom(emailExist),
    validarCampos,
  ],
  userPost
);

module.exports = router;
