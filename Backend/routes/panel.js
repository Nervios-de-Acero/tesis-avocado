const express = require('express');
const router = express.Router();
const funcionesToken = require('../utils/token');

//#region controllers

const panelController = require('../controllers/panelController');

//#endregion

router.route('/example')
.get(panelController.renderizarExample)
.post(panelController.renderizarExampleSubmit);

router.route('/crearReceta')
.get(panelController.renderCrearReceta)
.post(panelController.agregarReceta);

//#region endpoints

//#endregion

module.exports = router;
