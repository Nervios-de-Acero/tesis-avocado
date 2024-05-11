const {validationResult} = require('express-validator')
const funciones = {};

//#region Funciones

/**
 * Funcion encargada de manejar las respuestas de las peticiones y devolverlas al Front.
 * @param {object} res
 * @param {object} datos
 * @return {undefined}
 */
funciones.manejoRespuestas = (res, datos) => {
    const response = datos.errors ? datos.errors : datos.data;
    const meta = datos.meta;

    return res.status(meta.status).send(response);
};

/**
 * Funcion para manejar las respuestas de las validaciones de checkSchema
 * @param {object} req
 * @param {object} res
 * @param {function} next
 * @return {undefined}
 */
funciones.validarJSON = (req, res, next) => {
    console.log('request', req)
const resValidaciones = validationResult(req).array()

if(resValidaciones.length > 0){
    funciones.manejoRespuestas(res, {
        errors: {
            message: "Error de validación",
            content: resValidaciones
        },
        meta: {
            status: 400,
        },
})
    return 
}
    next()
}

//#endregion

module.exports = funciones;
