const express = require('express')
const router = express.Router()
const { checkSchema } = require('express-validator')
const validaciones = require('../utils/validacionesRegistro')
const controller = require('../controllers/registroController')
const funcionesComunes = require('../utils/funcionesComunes')

router.post('/', checkSchema(validaciones), funcionesComunes.validarJSON, controller.registro )

module.exports = router