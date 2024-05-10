const express = require('express');
const router = express.Router();
const funcionesComunes = require('../utils/funcionesComunes');
const { checkSchema, validationResult } = require('express-validator');
const validaciones = require('../utils/validacionesLogin');
const { login } = require('../controllers/loginController');

// Iniciar sesión
router.post('/', checkSchema(validaciones), funcionesComunes.validarJSON, login);

module.exports = router;



/* router.post('/', checkSchema(validaciones), async (req, res) => {
  try {
    await login(req, res);
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    funcionesComunes.manejoRespuestas(res, {
      errors: {
        message: 'Error interno del servidor al iniciar sesión'
      },
      meta: {
        status: 500
      }
    });
  }
});

module.exports = router; */


/* const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const validaciones = require('../utils/validacionesLogin');
const { login } = require('../controllers/loginController');

// Iniciar sesión
router.post('/', checkSchema(validaciones), login);

module.exports = router; */


/* router.get('/test', async function(req, res){
  try {
    const results = await db.promise().query('SELECT mensaje FROM test');
    console.log(results)
    res.send(results[0]); 
  } catch (error) {
    console.error('Error al realizar la consulta:', error);
    res.status(500).send('Error al obtener datos de la base de datos');
  }
  
})

// Iniciar sesión
router.post('/', checkSchema(validaciones), (req, res) => {

  if (Object.keys(req.body).length === 0 || typeof req.body.password === 'undefined' || typeof req.body.email === 'undefined') {
    res.status(400).send('Bad request. Campos incorrectos')
    return
  }

  const resValidaciones = validationResult(req).array()

  if (resValidaciones.length > 0) {
    res.send({
      success: false,
      message: "Error al iniciar sesión. Campos inválidos",
      content: resValidaciones
    })
    return
  }

  const pass = req.body.password;
  let resBody = {}

  db.query(`CALL sp_iniciarSesion('${req.body.email}');`, function (error, results, fields) {
    const response = results[0][0]
    if (error) {
      res.send(error)
    }
    else {
      if (response.success) {
        if (bcrypt.compareSync(pass, response.result)) {
          resBody = { success: true, message: "Sesión iniciada" }
          req.session.user = {
            email: req.body.email
          }
        }
        else { resBody = { success: false, message: "Contraseña incorrecta" } }
      }
      else {
        resBody = {
          success: false,
          message: 'El usuario no existe'
        }
      }
      res.send(resBody)
    }
  })
})

// Crear hash para usuarios de prueba
router.post('/hash', (req, res) => {
  console.log(req.body)
  const hash = bcrypt.hashSync(req.body.contraseña, 12)
  res.send({
    pass: req.body.contraseña,
    hash
  })
})  */
