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

router.put('/modificarPassword', checkSchema(validacionesPass), (req, res) => {
    const resValidaciones = validationResult(req).array();
    const pass = req.body.password;
    const nuevoPass = req.body.nuevoPassword;
    const email = req.body.email;

    if (!email || !pass || !nuevoPass) {
        res.status(400).json('Error. Faltan campos obligatorios');
        return;
    }
    if (resValidaciones.length > 0) {
        res.send({
            success: false,
            message: 'Campos inválidos',
            result: resValidaciones,
        });
        return;
    }

    db.query(`SELECT contraseña FROM usuarios WHERE email = '${email}';`, function (error, results) {
        if (error) {
            res.send({
                success: false,
                message: error,
            });
            return;
        } else {
            const resultado = results[0];
            if (bcrypt.compareSync(pass, resultado.contraseña)) {
                db.query(`UPDATE usuarios SET contraseña = '${bcrypt.hashSync(nuevoPass, 12)}' WHERE email = '${email}';`, function (error, results) {
                    if (error) {
                        res.send({
                            success: false,
                            message: error,
                        });
                        return;
                    } else {
                        res.send({
                            success: true,
                            message: 'Contraseña actualizada correctamente',
                        });
                        return;
                    }
                });
            } else {
                res.send({
                    success: false,
                    message: 'La contraseña es incorrecta',
                });
            }
        }
    });
});

router.put('/actualizarImagen', (req, res) => {
    if (!req.body.imagen || !req.body.email) {
        res.status(400).json('Error. Imagen y mail obligatorios.');
        return;
    }
    db.query(`UPDATE usuarios SET imagen = '${req.body.imagen}' WHERE email = '${req.body.email}'`, function (error, results) {
        if (error) {
            res.send({
                success: false,
                message: error,
            });
            return;
        } else {
            res.send({
                success: true,
                message: 'Imagen actualizada',
            });
        }
    });
});

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
