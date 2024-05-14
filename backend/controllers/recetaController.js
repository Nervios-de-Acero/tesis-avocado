const db = require('../conection');
const funcionesComunes = require('../utils/funcionesComunes');
const funcionesToken = require('../utils/token');

const controller = {};

//#region Controladores

controller.getRecetasUsuario = (req, res) => {
    const token = req.headers.authorization;
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

    try {
        db.query(`CALL sp_getRecetasUsuario('${email}')`, (error, results) => {
            if (error) {
                funcionesComunes.manejoRespuestas(res, {
                    errors: {
                        message: error,
                    },
                    meta: {
                        status: 400,
                    },
                });
            } else if (results[0]) {
                funcionesComunes.manejoRespuestas(res, {
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

controller.modificarReceta = (req, res) => {
    const token = req.headers.authorization;
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

    const idR = req.body.idReceta || null,
        titulo = req.body.titulo || null,
        descripcion = req.body.descripcion || null,
        tiempoCoccion = req.body.tiempoCoccion || null,
        dificultad = req.body.dificultad || null,
        ingredientes = req.body.ingredientes || null,
        pasos = req.body.pasos || null,
        imagen = req.body.imagen || null,
        categorias = req.body.categorias || null;

    try {
        db.query(`CALL sp_actualizarReceta(?, ? , ? , ? , ?, ?, ?, ?, ?)`, [idR, titulo, descripcion, tiempoCoccion, dificultad, JSON.stringify(pasos), JSON.stringify(ingredientes), JSON.stringify(categorias), imagen], (error, results) => {
            if (error) {
                throw new Error(error)
            } else {
                funcionesComunes.manejoRespuestas(res, {
                    data: {
                        message: 'Receta actualizada correctamente',
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
                message: 'Token de autenticación no proporcionado'
            },
            meta: {
                status: error.code === 'ER_SIGNAL_EXCEPTION' && error.errno === 1644 ? 409 : 500,
            },
        });
    }
};

controller.getProductos = (req, res) => {
    try {
        db.query(`CALL sp_getProductos();`, (error, results) => {
            if (error) {
                funcionesComunes.manejoRespuestas(res, {
                    errors: {
                        message: error.message,
                    },
                    meta: {
                        status: 500,
                    },
                });
            } else {
                funcionesComunes.manejoRespuestas(res, {
                    data: {
                        message: '',
                        content: results[0]
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
};

controller.crearProducto = (req, res) => {
    const nombre = req.body.nombre,
        cantPersonas = req.body.cantPersonas,
        cantRecetas = req.body.cantRecetas,
        precio = req.body.precio;

    try {
        db.query(
            `CALL sp_crearReceta('${req.body.titulo}', '${req.body.email}', ${tiempoCoccion}, ${dificultad}, '${req.body.descripcion}', '${req.body.imagen}', '${JSON.stringify(req.body.ingredientes)}', '${JSON.stringify(req.body.pasos)}', ${categorias});`,
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

controller.agregarReceta = (req, res) => {
    
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

    const idR = req.body.idReceta || null,
        titulo = req.body.titulo || null,
        descripcion = req.body.descripcion || null,
        tiempoCoccion = req.body.tiempoCoccion || null,
        dificultad = req.body.dificultad || null,
        ingredientes = req.body.ingredientes || null,
        pasos = req.body.pasos || null,
        imagen = req.body.imagen || null,
        categorias = req.body.categorias || null;

    try {
        db.query(`CALL sp_actualizarReceta(?, ? , ? , ? , ?, ?, ?, ?, ?)`, [email, titulo, tiempoCoccion, dificultad, descripcion, imagen, JSON.stringify(ingredientes),JSON.stringify(pasos), JSON.stringify(categorias)], (error, results) => {
            if (error) {
                throw new Error(error)
            } else {
                funcionesComunes.manejoRespuestas(res, {
                    data: {
                        message: 'Receta creada correctamente',
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
                message: 'Token de autenticación no proporcionado'
            },
            meta: {
                status: error.code === 'ER_SIGNAL_EXCEPTION' && error.errno === 1644 ? 409 : 500,
            },
        });
    }
};
module.exports = controller;
