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

controller.renderCargarReceta = (req, res) => {

    const endpoint = req.path.split('/');

    switch(endpoint[2]){

        case 'agregar': 
            res.render(`cargarReceta`, {modo: 'Agregar', idReceta: null});
            break;
        
        case 'editar':
            const idReceta = req.params.idReceta;
            res.render(`cargarReceta`, {modo: 'Editar', idReceta: idReceta});
            break;

        default:
            funcionesComunes.manejoRespuestas(res, {
                errors:{
                    message: 'Ruta no existente',
                },
                meta:{
                    status: 404,
                }
            })
    }

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

controller.renderListaProductos = (req, res) => {

    try {
        db.query('CALL sp_getProductos();', (error, results) => {
            if (error) {
                throw new Error(error)
            } else {
                data = results[0]
                console.log(data)
                res.render('listaProductos', {data});
            }
        });
    } catch (error) {
        console.error(error)
    }
    
}

controller.renderCrearProducto = (req, res) => {
    res.render(`crearProducto`);
}

//#endregion

module.exports = controller;