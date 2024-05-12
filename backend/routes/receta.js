const express = require('express');
const router = express.Router();
const { checkSchema, validationResult } = require('express-validator');
const validacion = require('../utils/validacionesRecetas');
const funcionesToken = require('../utils/token');
const funcionesComunes = require('../utils/funcionesComunes')

//#region Controllers

const recetaController = require('../controllers/recetaController');

//#endregion

//#region Rutas

router.post('/agregarReceta', checkSchema(validacion), (req, res) => {
    if (
        typeof req.body.titulo == 'undefined' ||
        typeof req.body.email == 'undefined' ||
        typeof req.body.descripcion == 'undefined' ||
        typeof req.body.imagen == 'undefined' ||
        typeof req.body.ingredientes == 'undefined' ||
        typeof req.body.pasos == 'undefined'
    ) {
        res.status(400).json('Error: Campos incompletos');
        return;
    }
    const resValidaciones = validationResult(req).array();
    if (resValidaciones.length > 0) {
        console.log(resValidaciones);
        res.send({
            success: false,
            message: 'Campos inválidos',
            content: resValidaciones,
        });
        return;
    }

    const categorias = req.body.categorias ? `'${JSON.stringify(req.body.categorias)}'` : null;
    const tiempoCoccion = req.body.tiempoCoccion ? `'${req.body.tiempoCoccion}'` : null;
    const dificultad = req.body.dificultad ? `'${req.body.dificultad}'` : null;

    db.query(
        `CALL sp_crearReceta('${req.body.titulo}', '${req.body.email}', ${tiempoCoccion}, ${dificultad}, '${
            req.body.descripcion
        }',
'${req.body.imagen}', '${JSON.stringify(req.body.ingredientes)}', '${JSON.stringify(req.body.pasos)}', ${categorias});`,
        function (error, results) {
            if (error) {
                res.send({
                    success: false,
                    message: error,
                });
                return;
            } else {
                const resultados = results[0][0];
                if (resultados.success === 0) {
                    res.send({
                        success: false,
                        message: resultados.message,
                    });
                } else {
                    res.send({
                        success: true,
                        message: resultados.message,
                    });
                }

                return;
            }
        }
    );
});

router.get('/getCategorias', recetaController.getCategorias);

router.get('/getRecetasFeed', recetaController.getRecetasFeed);

router.get('/getProductos', recetaController.getProductos)

router.get('/buscarReceta/:titulo', (req, res) => {
    const titulo = req.params.titulo;
    db.query(`CALL sp_buscarReceta('${titulo}');`, function (error, results) {
        if (error) {
            res.send({
                success: false,
                message: error,
            });
        } else {
            res.send({
                success: true,
                message: '',
                content: results[0],
            });
        }
    });
});

router.get('/getRecetaById', recetaController.getRecetaById);

router.get('/getRecetasUsuario/:email', funcionesToken.validateToken, recetaController.getRecetasUsuario);

router.delete('/eliminarReceta/:id', (req, res) => {
    const id = req.params.id;
    db.query(`DELETE FROM recetas WHERE idReceta = ${id}`, function (error, results) {
        if (error) {
            res.send({
                success: false,
                message: error,
            });
        } else {
            if (results.affectedRows === 0) {
                res.send({
                    success: false,
                    message: 'No hay recetas con ese ID',
                });
            } else {
                res.send({
                    success: true,
                    message: 'Se eliminó la receta correctamente',
                });
            }
        }
    });
});

//#endregion

module.exports = router;
