const { checkSchema } = require('express-validator');

const validaciones = {
    actualizarPerfil: checkSchema({
        nombreCompleto: {
            optional: true,
            isString: true,
            errorMessage: 'Nombre completo inválido',
        },
        usuario: {
            optional: true,
            isString: true,
            errorMessage: 'Usuario inválido',
        },
        imagen: {
            optional: true,
            isString: true,
            errorMessage: 'URL de imagen inválida',
        },
        email: {
            notEmpty: {
                errorMessage: 'Campo obligatorio',
                bail: true,
            },
            isEmail: {
                errorMessage: 'Email inválido',
            },
        },
    }),

    modificarPassword: checkSchema({
        email: {
            notEmpty: {
                errorMessage: 'Campo obligatorio',
                bail: true,
            },
            isEmail: {
                errorMessage: 'Email inválido',
            },
        },
        password: {
            notEmpty: {
                errorMessage: 'Campo obligatorio',
                bail: true,
            },
        },
        nuevoPassword: {
            notEmpty: {
                errorMessage: 'Campo obligatorio',
                bail: true,
            },
            isStrongPassword: {
                options: {
                    minLength: 8,
                    maxLength: 24,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                },
                errorMessage: 'La contraseña debe tener entre 8 y 24 caracteres, una mayúscula, una minúscula, un caracter especial y un número',
            },
        },
    }),
};

module.exports = validaciones;
