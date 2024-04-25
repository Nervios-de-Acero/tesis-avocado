const db = require('../conection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Controlador para el inicio de sesión
exports.login = (req, res) => {
    if (Object.keys(req.body).length === 0 || typeof req.body.password === 'undefined' || typeof req.body.email === 'undefined') {
        return res.status(400).json({ errors: [{ message: 'Bad request. Campos incorrectos' }] });
    }

    db.query(`CALL sp_iniciarSesion('${req.body.email}');`, function (error, results, fields) {
        if (error) {
            return res.status(500).json({ errors: [{ message: 'Error interno del servidor' }] });
        }

        const response = results[0][0];
        if (response.success) {
            if (bcrypt.compareSync(req.body.password, response.result)) {
                const token = jwt.sign({ email: req.body.email }, 'secret_key', { expiresIn: '1h' });
                return res.status(200).json({
                    data: {
                        id: '1', // Puedes proporcionar un id único para el usuario
                        type: 'users',
                        attributes: {
                            email: req.body.email,
                            token: token
                        }
                    }
                });
            } else {
                return res.status(401).json({ errors: [{ message: 'Contraseña incorrecta' }] });
            }
        } else {
            return res.status(404).json({ errors: [{ message: 'El usuario no existe' }] });
        }
    });
};