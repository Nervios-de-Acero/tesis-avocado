const express = require('express');
const router = express.Router();
const funcionesComunes = require('../utils/funcionesComunes');
const { checkSchema, validationResult } = require('express-validator');
const validaciones = require('../utils/validacionesLogin');
const { login } = require('../controllers/loginController');

// Iniciar sesión
router.post('/', checkSchema(validaciones), funcionesComunes.validarJSON, login);

module.exports = router;