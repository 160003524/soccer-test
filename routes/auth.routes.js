const { Router } = require('express');
const { check } = require('express-validator');

const { login } = require('../controllers/auth.controller');

const { validarCampos } = require('../middleswares/validar-campos');

const router = Router();
router.post(
  '/login',
  [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('passwordN', 'La contrasena es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login
);

module.exports = router;
