const funcionesComunes = require('../utils/funcionesComunes');
const funcionesToken = require('../utils/token');

const controller = {};

//#region Controllers

controller.renderizarExample = (req, res) => {
    // Ejemplo de como sacar parametros de la query:
    //
    // Ej: localhost:3008/panel/example?parametro=13
    // 
    // const parametro = req.query.parametro
    //
    // parametro va a ser igual a 13

    res.render(`example`, {
        testTitle: 'Que se come hoy banda?',
        testValue: 'Empanada a la Pomarola'
    });
}

controller.renderizarExampleSubmit = (req, res) => {

    res.render(`exampleSubmit`);
}

controller.renderCrearReceta = (req, res) => {

    res.render(`crearReceta`);
}

controller.renderCrearProducto = (req, res) => {
    res.render(`crearProducto`);
}

//#endregion

module.exports = controller;