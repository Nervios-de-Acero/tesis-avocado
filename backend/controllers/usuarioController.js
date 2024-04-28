const db = require('../conection');
const { validationResult } = require('express-validator');
const funcionesToken = require('../utils/token');
const funcionesComunes = require('../utils/funcionesComunes');

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
                success: false,
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
    return;
};

module.exports = controller;
