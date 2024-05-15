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
        categorias = req.body.categorias || null,
        imagen = req.body.imagen || null;

    try {
        db.query(`CALL sp_actualizarReceta(?, ? , ? , ? , ?, ?, ?, NULL, ?)`, [idR, titulo, descripcion, tiempoCoccion, dificultad, JSON.stringify(pasos), JSON.stringify(ingredientes), JSON.stringify(categorias), imagen], (error, results) => {
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
                message: error.message,
            },
            meta: {
                status: 500,
            },
        });
    }
    return;
}

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
    return;
}

controller.getRecetasFeed = (req, res) => {

    const categoria = Number(req.query.categoria) || null
    // if(categoria && Number.isNaN(categoria)){
    //     console.log(Number.isInteger(categoria))
    //     funcionesComunes.manejoRespuestas(res, {
    //         errors: {
    //             message: 'Error: El límite debe ser un número entero. ',
    //         },
    //         meta: {
    //             status:  400,
    //         },
    //     })
    //     return
    // }

    try {
        db.query(`CALL sp_getRecetasFeed(?);`, [categoria], (error, results) => {
            if (error) {
                funcionesComunes.manejoRespuestas(res, {
                    errors: {
                        message: error.message,
                    },
                    meta: {
                        status:  500,
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
    return;
}

controller.agregarReceta = (req, res) => {
    const token = req.headers.authorization;
    const email = funcionesToken.decodeToken(token)
    
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

    const titulo = req.body.titulo || null,
        descripcion = req.body.descripcion || null,
        tiempoCoccion = req.body.tiempoCoccion || null,
        dificultad = req.body.dificultad || null,
        ingredientes = req.body.ingredientes || null,
        pasos = req.body.pasos || null,
        imagen = req.body.imagen || null,
        categorias = req.body.categorias || null;

    try {
        db.query(`CALL sp_crearReceta(?, ? , ? , ? , ?, ?, ?, ?, ?)`, [email, titulo, tiempoCoccion, dificultad, descripcion, imagen, JSON.stringify(ingredientes),JSON.stringify(pasos), JSON.stringify(categorias)], (error, results) => {
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
        console.error(error)
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

controller.crearProducto = (req, res) => {
    const nombre = req.body.nombre,
        cantPersonas = req.body.cantPersonas,
        cantRecetas = req.body.cantRecetas,
        precio = req.body.precio;

        try {
            db.query(`CALL sp_crearProducto(?, ?, ?, ?);`, [nombre, cantPersonas, cantRecetas, precio], (error, results) => {
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
                            message: 'Producto Creado correctamente'
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
        return;
}

controller.getRecetaById = (req, res) => {
    const idReceta = req.query.id;
    try {
        db.query(`CALL sp_getReceta(?);`,[idReceta], function(error, results) {
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
                        message: '',
                        content: results[0][0]
                    },
                    meta: {
                        status: 200,
                    },
                });
            }})
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
    return; 
    }

controller.getCategorias = (req, res) => {
    try {
        db.query(`SELECT * FROM categorias;`, function(error, results) {
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
                        message: '',
                        content: results
                    },
                    meta: {
                        status: 200,
                    },
                });
            }})
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

//#endregion

module.exports = controller;
