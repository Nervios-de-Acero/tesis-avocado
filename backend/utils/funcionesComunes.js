const funciones = {};

//#region Funciones

/**
 *
 * @param {object} res
 * @param {object} datos
 * @return {undefined}
 */
funciones.manejoRespuestas = (res, datos) => {
    const response = datos.error ? datos.errors : datos.data;
    const meta = datos.meta;

    return res.status(meta.status).send(response);
};

//#endregion

module.exports = funciones;
