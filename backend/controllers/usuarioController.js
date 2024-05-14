const db = require('../conection');
const funcionesToken = require('../utils/token');
const funcionesComunes = require('../utils/funcionesComunes');
const validacionesPassword = require('../utils/validacionesPassword'); // Importar el archivo de validaciones
const { validationResult } = require('express-validator'); // Agregar la importación de validationResult
const bcrypt = require('bcrypt');



const controller = {};

controller.actualizarPerfil = (req, res) => {
    const resValidaciones = validationResult(req).array();
    const nombreCompleto = req.body.nombreCompleto || null;
    const usuario = req.body.usuario || null;
    const imagen = req.body.imagen || null;

    const token = req.headers.token;
    const email = funcionesToken.decodeToken(token);

    if (!email) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: 'Error. Email obligatorio.',
            },
            meta: {
                status: 401,
            },
        });
        return;
    }

    if (resValidaciones.length > 0) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: 'Campos inválidos',
                content: resValidaciones,
            },
            meta: {
                status: 406,
            },
        });
        return;
    }

    try {
        db.query(`CALL sp_actualizarPerfil('${email}', '${nombreCompleto}', '${imagen}', '${usuario}');`, function (error, results) {
            if (error) {
                funcionesComunes.manejoRespuestas(res, {
                    errors: {
                        message: error,
                    },
                    meta: {
                        status: 400,
                    },
                });
            } else {
                funcionesComunes.manejoRespuestas(res, {
                    error: {
                        message: 'Se actualizaron los datos correctamente',
                    },
                    meta: {
                        status: 201,
                    },
                });
            }
        });
    } catch (error) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: error,
            },
            meta: {
                status: 500,
            },
        });
    }
};



// controller.modificarPassword = (req, res) => {


//     const pass = req.body.password;
//     const nuevoPass = req.body.nuevoPassword;
//     const token = req.headers.authorization;
//     const userData = funcionesToken.decodeToken(token);
//     const email = userData.email;

//     try {
//         db.query(`SELECT contraseña FROM usuarios WHERE email = '${email}';`, function (error, results) {
//             if (error) {
//                 funcionesComunes.manejoRespuestas(res, {
//                     errors: {
//                         message: error,
//                     },
//                     meta: {
//                         status: 500,
//                     },
//                 });
//                 return;
//             } else {
//                 const resultado = results[0];
//                 if (bcrypt.compareSync(pass, resultado.contraseña)) {
//                     db.query(`CALL sp_actualizarPerfil(NULL, NULL, NULL, NULL,  ' ${bcrypt.hashSync(nuevoPass, 12)}' );` , function (error, results) {
//                         if (error) {

//                             throw new Error(error)
                        
//                         } else {
//                             funcionesComunes.manejoRespuestas(res, {
//                                 error: {
//                                     message: 'Contraseña actualizada correctamente',
//                                 },
//                                 meta: {
//                                     status: 201,
//                                 },
//                             });
//                             return;
//                         }
//                     });
//                 } else {
//                     funcionesComunes.manejoRespuestas(res, {
//                         errors: {
//                             message: 'La contraseña es incorrecta',
//                         },
//                         meta: {
//                             status: 401,
//                         },
//                     });
//                     return;
//                 }
//             }
//         });
//     } catch (error) {
//         console.error(error)
//         funcionesComunes.manejoRespuestas(res, {
//             errors: {
//                 message: error.message,
//             },
//             meta: {
//                 status: error.code === 'ER_SIGNAL_EXCEPTION' && error.errno === 1644 ? 409 : 500,
//             },
//         });

//         return;
//     }
// };
module.exports = controller;


