const bcrypt = require('bcrypt');
const db = require('../conection');
const { validationResult, Result } = require('express-validator');
const tokenFunctions = require('../utils/token');

const controller = {};

controller.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const userData = await db.promise().query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    const user = userData[0][0]; // Obtener el primer resultado de la consulta
    console.log(userData)
    // Si el usuario no existe, enviar un mensaje de error
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = tokenFunctions.generateToken({ email: user.email });

    // Enviar el token como respuesta
    res.status(200).json({ message: 'Sesión iniciada', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor, contáctese con el administrador' });
  }
};

module.exports = controller;




/* const controller = {};

controller.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    const userData = await db.query(`SELECT * FROM usuarios WHERE email = ?`, [email]);
    const user = userData[0];
    console.log(userData)
    // Si el usuario no existe, enviar un mensaje de error
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña es válida
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = tokenFunctions.generateToken({ email: user.email });

    // Enviar el token como respuesta
    res.status(200).json({ message: 'Sesión iniciada', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error del servidor, contáctese con el administrador' });
  }
};

module.exports = controller ;
 */