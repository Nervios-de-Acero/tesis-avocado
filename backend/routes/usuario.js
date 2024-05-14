const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { checkSchema } = require('express-validator');
const validaciones = require('../utils/validacionesPerfil');
const validacionesPass = require('../utils/validacionesPassword');
const funcionesToken = require('../utils/token');

//#region Controllers

const usuarioController = require('../controllers/usuarioController');

//#endregion

//#region Endpoints

router.get('/getUsuario/:email', (req, res) => {
    console.log(req.params.email);
    db.query(`SELECT email, nombreCompleto, usuario, CONVERT(imagen USING utf8) AS imagen FROM usuarios WHERE email = '${req.params.email}'`, function (error, results) {
        if (error) {
            res.send({
                success: true,
                message: error,
            });
            return;
        } else {
            res.send({
                success: true,
                message: '',
                content: results[0],
            });
        }
    });
});

router.put('/actualizarPerfil', funcionesToken.validateToken, checkSchema(validaciones), usuarioController.actualizarPerfil);

router.put('/modificarPassword', funcionesToken.validateToken, checkSchema(validacionesPass),usuarioController.modificarPassword) 


router.delete('/eliminar', (req, res) => {
    const email = req.body.email;
    console.log(email);
    if (typeof email === 'undefined') {
        res.status(400).json('No se encontró el email');
        return;
    }
    db.query(`DELETE FROM usuarios WHERE email = '${email}'`, function (error, results) {
        if (error) {
            res.send(error);
        } else {
            req.session.destroy((err) => {
                if (err) {
                    res.send({
                        success: false,
                        message: err,
                    });
                    return;
                }
            });
            res.send({
                success: true,
                message: 'Usuario eliminado correctamente',
            });
        }
    });
});

//#endregion

module.exports = router;
