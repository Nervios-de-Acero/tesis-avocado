const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const tokenFunctions = require('../utils/token');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userData = await db.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    
    if (userData.length === 0) {
      return res.status(404).send({ message: 'El usuario no existe' });
    }

    const user = userData[0];
    
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).send({ message: 'Usuario o contraseña incorrectos' });
    }

    // Generar el token JWT
    const token = tokenFunctions.generateToken({ userId: user.id });

    // Enviar el token JWT en la respuesta
    res.status(200).send({ message: 'Sesión iniciada', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send({ message: 'Error del servidor, contáctese con el administrador' });
  }
};

module.exports = { login };