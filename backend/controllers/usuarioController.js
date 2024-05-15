const db = require('../conection');
const { validationResult } = require('express-validator');
const funcionesToken = require('../utils/token');
const funcionesComunes = require('../utils/funcionesComunes');

const controller = {};

controller.actualizarPerfil = (req, res) => {
    const nombreCompleto = req.body.nombreCompleto || null;
    const usuario = req.body.usuario || null;
    // const imagen = req.body.imagen || null; -- Se remueve para una futura integración

    const token = req.headers.authorization;
    const email = funcionesToken.decodeToken(token);
    console.log(email)

    try {
        db.query(`CALL sp_actualizarPerfil(?, ?, NULL, ?, NULL);`, [email, nombreCompleto, usuario], function (error, results) {
            if (error) {
                throw new Error(error)
            } else {
                funcionesComunes.manejoRespuestas(res, {
                    data: {
                        message: 'Se actualizaron los datos correctamente',
                    },
                    meta: {
                        status: 201,
                    },
                });
            }
        });
    } catch (error) {
        console.error(error)
        funcionesComunes.manejoRespuestas(res, {
            errors: {
                message: error.message,
            },
            meta: {
                status: error.code === 'ER_SIGNAL_EXCEPTION' && error.errno === 1644 ? 409 : 500,
            },
        });
    }
    return;
};

module.exports = controller;
