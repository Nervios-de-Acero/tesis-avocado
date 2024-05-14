const validaciones = {
  nombreCompleto: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'nombreCompleto' requerido.",
      bail: true
    },
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    },
    matches: {
      options: /^[A-Za-z\s]+$/,
      errorMessage: 'El nombre no debe contener números ni caracteres especiales'
    }
  },
  email: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'email' requerido.",
      bail: true
    },
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    },
    isEmail: {
      errorMessage: 'Email inválido'
    }
  },
  password: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'password' requerido.",
      bail: true
    },
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    },
    isStrongPassword: {
      options: {
        minLength: 8,
        maxLength: 24,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      },
      errorMessage: 'La contraseña debe tener entre 8 y 24 caracteres, una mayúscula, una minúscula, un caracter especial y un número'
    }
  },
  usuario: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'usuario' requerido.",
      bail: true
    },
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    },
    isLength: {
      options: {
        min: 5,
        max: 15,
      },
      errorMessage: 'El nombre de usuario debe tener entre 5 y 15 caracteres',
      bail: true
    },
    matches: {
      options: /^\S+$/,
      errorMessage: 'El nombre de usuario no debe contener espacios',
      bail: true
    } 
  }
}

module.exports = validaciones;