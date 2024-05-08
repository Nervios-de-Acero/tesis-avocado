const bcrypt = require('bcrypt')
const db = require('../conection')
const funcionesComunes = require('../utils/funcionesComunes');
const controller = {}

controller.registro = (req, res) => {
//   if(Object.keys(req.body).length === 0 || typeof req.body.password === 'undefined' || typeof req.body.email === 'undefined' || typeof req.body.nombreCompleto === 'undefined' || typeof req.body.usuario === 'undefined'){
//     res.status(400).send('Bad request. Campos incorrectos')
//     return
// } 
// const resValidaciones = validationResult(req).array()

// if(resValidaciones.length > 0){
//   res.send({
//     success: false,
//     message: "Error en registro. Campos inválidos",
//     content: resValidaciones
//   })
//   console.log(req.body)
//   return
// }

const email = req.body.email,
  nombreCompleto = req.body.nombreCompleto,
  usuario = req.body.usuario,
  pass = bcrypt.hashSync(req.body.password, 12);

// lógica de registro
  try {
    db.query(`CALL sp_registro(?,?,?,?,?);`, [email, nombreCompleto, usuario, pass, 0], (error, results) => {
        if (error) {
            funcionesComunes.manejoRespuestas(res, {
                errors: {
                    message: error.message,
                },
                meta: {
                    status: error.code === 'ER_SIGNAL_EXCEPTION' && error.errno === 1644 ? 409 : 500,
                },
            });
        } else {
            funcionesComunes.manejoRespuestas(res, {
                data: {
                    message: '¡Usuario registrado exitosamente!',
                },
                meta: {
                    status: 200,
                },
            });
        }
    });
} catch (error) {
    funcionesComunes.manejoRespuestas(res, {
        errors: {
            message: error.message,
        },
        meta: {
            status: 500,
        },
    });
}
}

module.exports = controller;