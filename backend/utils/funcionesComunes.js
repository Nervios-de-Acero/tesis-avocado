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

//#endregion

module.exports = funciones;
