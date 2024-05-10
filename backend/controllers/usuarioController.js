const db = require('../conection');
const funcionesToken = require('../utils/token');
const funcionesComunes = require('../utils/funcionesComunes');
const tokenFunctions = require('../utils/token');
const validacionesPassword = require('../utils/validacionesPassword'); // Importar el archivo de validaciones
const { validationResult } = require('express-validator'); // Agregar la importación de validationResult

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

controller.modificarPassword = (req, res) => {
    // Verificar el token
    const token = req.headers.authorization;
    if (!token) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: 'Token de autenticación no proporcionado'
            },
            meta: {
                status: 401
            }
        });
        return;
    }

    try {
        const decodedToken = tokenFunctions.verifyToken(token);
        if (!decodedToken) {
            funcionesComunes.manejoRespuestas(res, {
                errors: {
                    message: 'Token de autenticación inválido'
                },
                meta: {
                    status: 401
                }
            });
            return;
        }

       // Validar los campos del formulario utilizando el esquema de validación
       const errores = validacionesPassword.modificarPassword(req);
       if (errores) {
           funcionesComunes.manejoRespuestas(res, {
               errors: errores,
               meta: {
                   status: 400
               }
           });
           return;
       }

        if (resValidaciones.length > 0) {
            funcionesComunes.manejoRespuestas(res, {
                errors: {
                    message: 'Campos inválidos',
                    result: resValidaciones
                },
                meta: {
                    status: 400
                }
            });
            return;
        }

        db.query(`SELECT contraseña FROM usuarios WHERE email = '${email}';`, function(error, results) {
            if (error) {
                funcionesComunes.manejoRespuestas(res, {
                    errors: {
                        message: error
                    },
                    meta: {
                        status: 500
                    }
                });
                return;
            } else {
                const resultado = results[0];
                if (bcrypt.compareSync(pass, resultado.contraseña)) {
                    db.query(`UPDATE usuarios SET contraseña = '${bcrypt.hashSync(nuevoPass, 12)}' WHERE email = '${email}';`, function(error, results) {
                        if (error) {
                            funcionesComunes.manejoRespuestas(res, {
                                errors: {
                                    message: error
                                },
                                meta: {
                                    status: 500
                                }
                            });
                            return;
                        } else {
                            funcionesComunes.manejoRespuestas(res, {
                                data: {
                                    message: 'Contraseña actualizada correctamente'
                                },
                                meta: {
                                    status: 200
                                }
                            });
                            return;
                        }
                    });
                } else {
                    funcionesComunes.manejoRespuestas(res, {
                        errors: {
                            message: 'La contraseña es incorrecta'
                        },
                        meta: {
                            status: 400
                        }
                    });
                    return;
                }
            }
        });

    } catch (error) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: 'Error al verificar el token'
            },
            meta: {
                status: 500
            }
        });
    }
};

module.exports = controller;


