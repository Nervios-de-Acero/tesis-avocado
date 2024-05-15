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

router.post('/agregarReceta',funcionesToken.validateToken, checkSchema(validacion),recetaController.agregarReceta)  

router.get('/getCategorias', recetaController.getCategorias);

router.get('/getRecetasFeed', recetaController.getRecetasFeed);

router.get('/getProductos', recetaController.getProductos)

// router.get('/buscarReceta/:titulo', (req, res) => {
//     const titulo = req.params.titulo;
//     db.query(`CALL sp_buscarReceta('${titulo}');`, function (error, results) {
//         if (error) {
//             res.send({
//                 success: false,
//                 message: error,
//             });
//         } else {
//             res.send({
//                 success: true,
//                 message: '',
//                 content: results[0],
//             });
//         }
//     });
// });

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
