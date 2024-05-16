const bcrypt = require('bcrypt');
const db = require('../conection');
const funcionesComunes = require('../utils/funcionesComunes');
const tokenFunctions = require('../utils/token');

const controller = {};

controller.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar si el usuario existe en la base de datos
    db.query(`CALL sp_getUsuario(?)`, [email], async (error, results) => {
      if (error) {
        funcionesComunes.manejoRespuestas(res, {
          errors: {
            message: error.message,
          },
          meta: {
            status: error.code === 'ER_SIGNAL_EXCEPTION' && error.errno === 1644 ? 409 : 500,
          },
        });
        return
      } else {
        // Verificar si la contraseña es válida
        const user = results[0][0]
        console.log(user)
        try {
          const validPassword = await bcrypt.compare(password, user.contraseña);
          if (!validPassword) {
            funcionesComunes.manejoRespuestas(res, {
              errors: {
                message: 'Contraseña incorrecta'
              },
              meta: {
                status: 401
              }
            });
            return;
          } else {
            // Generar token JWT
            const token = tokenFunctions.generateToken({ email: user.email, isAdmin: !!user.isAdmin });
            delete user.isAdmin
            delete user.contraseña

            // Enviar el token e info de usuario como respuesta
            funcionesComunes.manejoRespuestas(res, {
              data: {
                message: 'Sesión iniciada',
                token,
                user
              },
              meta: {
                status: 200
              }
            })
          }
        } catch (bcryptError) {
          console.error('Error al comparar contraseñas:', bcryptError);
          funcionesComunes.manejoRespuestas(res, {
            errors: {
              message: 'Error del servidor, contáctese con el administrador'
            },
            meta: {
              status: 500
            }
          });
        }
      }
    })
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    funcionesComunes.manejoRespuestas(res, {
      errors: {
        message: 'Error del servidor, contáctese con el administrador'
      },
      meta: {
        status: 500
      }
    });
  }
};

module.exports = controller;