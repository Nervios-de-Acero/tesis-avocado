const express = require('express');
const router = express.Router();
const {
    checkSchema,
    validationResult
} = require('express-validator');
const validacion = require('../utils/validacionesRecetas');
const funcionesToken = require('../utils/token');
const multer = require('multer');
const funcionesComunes = require('../utils/funcionesComunes')
const productosValidaciones = require('../utils/validacionesProductos')

//#region Variables

const upload = multer();

//#endregion

//#region Controllers

const recetaController = require('../controllers/recetaController');

//#endregion

//#region Rutas

router.post('/agregarReceta', funcionesToken.validateToken, checkSchema(validacion), recetaController.agregarReceta)

router.put('/modificarReceta', funcionesToken.validateToken, recetaController.modificarReceta)

router.post('/crearProducto', funcionesToken.validateToken, checkSchema(productosValidaciones), funcionesComunes.validarJSON, recetaController.crearProducto)

router.get('/getCategorias', (req, res) => {
    db.query(`SELECT * FROM categorias;`, function (error, results) {
        if (error) {
            res.send({
                success: false,
                message: error,
            });
        } else {
            res.send({
                success: true,
                message: '',
                content: results,
            });
        }
    });
});

router.get('/getRecetasFeed', (req, res) => {
    db.query(
        `SELECT  r.idReceta, r.titulo, u.usuario AS creadoPor, CONVERT(r.imagen USING utf8) AS imagen, r.fechaCreacion, r.descripcion, r.fechaActualizacion FROM recetas r INNER JOIN usuarios u ON u.idUsuario = r.creadoPor LIMIT 20;`,
        function (error, results) {
            if (error) {
                res.send({
                    success: false,
                    message: error,
                });
            } else {
                res.send({
                    success: true,
                    message: '',
                    content: results,
                });
            }
        }
    );
});

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

router.get('/getRecetaById/:id', (req, res) => {
    const idReceta = req.params.id;
    db.query(`CALL sp_getReceta(${idReceta});`, function (error, results) {
        if (error) {
            res.send({
                success: false,
                message: error,
            });
        } else {
            res.send(results[0][0]);
            return;
        }
    });
});

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
                console.log('test')
            } else {
                res.send({
                    success: true,
                    message: 'Se eliminó la receta correctamente',
                });
            }
        }
    });
});

router.post('/eliminarProducto/:id', funcionesToken.isAdmin, recetaController.eliminarProducto);

router.post('/eliminarReceta/:id', funcionesToken.isAdmin, recetaController.eliminarReceta);

//#endregion

module.exports = router;