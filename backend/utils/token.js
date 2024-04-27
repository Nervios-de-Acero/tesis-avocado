require('dotenv').config();
const jwt = require('jsonwebtoken');

const tokenFunctions = {
  generateToken: (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30m' });
  },
  validateToken: (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).send({ errors: [{ status: '401', title: 'unauthorized', message: 'No autorizado' }] });
    }
    const token = accessToken.split(' ')[1]; // Remover 'Bearer ' del encabezado de autorización
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err);
        return res.status(401).send({ errors: [{ status: '401', title: 'unauthorized', message: 'Token expirado o incorrecto. Inicie sesión nuevamente' }] });
      } else {
        req.user = user; // Adjuntar el usuario decodificado a la solicitud
        return next();
      }
    });
  },
  isLoggedIn: (req, res, next) => {
    const accessToken = req.headers.authorization;
    if (accessToken) {
      return res.status(403).send({ errors: [{ status: '403', title: 'forbidden', message: 'Usuario ya logueado. Salga de la sesión para acceder a esta función' }] });
    } else {
      return next();
    }
  }
};

module.exports = tokenFunctions;