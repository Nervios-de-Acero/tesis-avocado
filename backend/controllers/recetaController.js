const db = require('../conection');
const funcionesComunes = require('../utils/funcionesComunes');
const funcionesToken = require('../utils/token');

const controller = {};

//#region Controladores

//Se agrega el controlador como propiedad del objeto "controller"
//Necesita como minimo parametros req y res
controller.getRecetasUsuario = (req, res) => {
    const token = req.headers.authorization;
    const email = funcionesToken.decodeToken(token);
    // const isAdmin =

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

    //Importante el try/catch() en caso de suceder error en el db.query
    try {
        db.query(`CALL sp_getRecetasUsuario('${email}')`, (error, results) => {
            if (error) {
                //Se llama a la funcion manejoRespuestas() del objeto funcionesComunes para enviar la respuesta al front
                //Se le pasa como primer parametro el res
                //Se le pasa como segundo parametro el objeto formateado con la informacion a devolver
                funcionesComunes.manejoRespuestas(res, {
                    //Debe llevar la propiedad errors si es un error
                    errors: {
                        message: error,
                    },
                    //Siempre debe llevar la propiedad meta
                    meta: {
                        //La propiedad meta siempre debe tener la subpropiedad status inicializada (si o si valor numerico)
                        status: 400,
                    },
                });
            } else if (results[0]) {
                funcionesComunes.manejoRespuestas(res, {
                    //Debe llevar la propiedad data si NO es un error
                    data: {
                        message: '',
                        content: results[0],
                    },
                    meta: {
                        status: 200,
                    },
                });
            } else {
                funcionesComunes.manejoRespuestas(res, {
                    data: {
                        message: 'No tienes recetas.',
                        content: [],
                    },
                    meta: {
                        status: 204,
                    },
                });
            }
        });
        //En el catch hacemos una respuesta de error si hay un error de la DB
    } catch (error) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                //Pasarle el error de catch en errors.message
                message: error,
            },
            meta: {
                status: 500,
            },
        });
    }
    return;
};

controller.modificarReceta = (req, res) => {
    const token = req.headers.authorization;
    const email = funcionesToken.decodeToken(token)
}

//#endregion



controller.agregarReceta = (req, res) => {
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

        const db = require('../conection');
const funcionesComunes = require('../utils/funcionesComunes');

const controller = {};

controller.agregarReceta = (req, res) => {
    if (
        typeof req.body.titulo == 'undefined' ||
        typeof req.body.email == 'undefined' ||
        typeof req.body.descripcion == 'undefined' ||
        typeof req.body.imagen == 'undefined' ||
        typeof req.body.ingredientes == 'undefined' ||
        typeof req.body.pasos == 'undefined'
    ) {
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: 'Error: Campos incompletos'
            },
            meta: {
                status: 400
            }
        });
        return;
    }

    const resValidaciones = validationResult(req).array();
    if (resValidaciones.length > 0) {
        console.log(resValidaciones);
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: 'Campos inválidos',
                content: resValidaciones
            },
            meta: {
                status: 400
            }
        });
        return;
    }

    const categorias = req.body.categorias ? `'${JSON.stringify(req.body.categorias)}'` : null;
    const tiempoCoccion = req.body.tiempoCoccion ? `'${req.body.tiempoCoccion}'` : null;
    const dificultad = req.body.dificultad ? `'${req.body.dificultad}'` : null;

    db.query(
        `CALL sp_crearReceta('${req.body.titulo}', '${req.body.email}', ${tiempoCoccion}, ${dificultad}, '${
            req.body.descripcion
        }', '${req.body.imagen}', '${JSON.stringify(req.body.ingredientes)}', '${JSON.stringify(req.body.pasos)}', ${categorias});`,
        (error, results) => {
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
                const resultados = results[0][0];
                if (resultados.success === 0) {
                    funcionesComunes.manejoRespuestas(res, {
                        errors: {
                            message: resultados.message
                        },
                        meta: {
                            status: 400
                        }
                    });
                } else {
                    funcionesComunes.manejoRespuestas(res, {
                        data: {
                            message: resultados.message
                        },
                        meta: {
                            status: 200
                        }
                    });
                }

                return;
            }
        }
    );
};

module.exports = controller;


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
