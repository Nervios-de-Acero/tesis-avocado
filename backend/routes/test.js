const express = require('express');
const router = express.Router();
const tokenFunctions = require('../utils/token');

// Ruta de prueba para decodificar el token
router.get('/decodeToken', (req, res) => {
  // Obtener el token del encabezado de autorización
  const accessToken = req.headers.authorization;

  // Verificar si el token existe
  if (!accessToken) {
    return res.status(401).send({ message: 'Token no proporcionado' });
  }

  // Separar el token de 'Bearer'
  const token = accessToken.split(' ')[1];

  // Decodificar el token
  const decodedEmail = tokenFunctions.decodeToken(token);

  // Verificar si se pudo decodificar el token
  if (!decodedEmail) {
    return res.status(401).send({ message: 'Token inválido' });
  }

  // Enviar el correo electrónico decodificado como respuesta
  res.send({ email: decodedEmail });
});

module.exports = router;