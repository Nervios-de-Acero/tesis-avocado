const express = require('express')
const router = express.Router()
const { checkSchema, validationResult} = require('express-validator')
const validaciones = require('../utils/validacionesRegistro')
const controller = require('../controllers/registroController')

router.post('/', checkSchema(validaciones), controller.registro )

module.exports = router