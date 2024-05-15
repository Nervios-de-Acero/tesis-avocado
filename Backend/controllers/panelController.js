const funcionesComunes = require('../utils/funcionesComunes');
const funcionesToken = require('../utils/token');
const db = require('../conection')

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

controller.renderListaRecetas = (req, res) => {
    try {
        db.query('CALL sp_getRecetasAdmin();', (error, results) => {
            if (error) {
                throw new Error(error)
            } else {
                data = results[0]
                console.log(data)
                res.render('listaRecetas', {data});
            }
        });
    } catch (error) {
        console.error(error)
    }
    
    }

controller.renderEditarReceta = (req, res) => {

    res.send('Estás en Editar receta');
}

controller.renderAgregarReceta = (req, res) => {

    res.send('Estás en agregar receta');
}

//#endregion

module.exports = controller;