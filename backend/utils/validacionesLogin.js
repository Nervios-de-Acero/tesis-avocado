const validaciones = {
  email: {
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    },
    isEmail: {
      errorMessage: 'Email inválido'
    },
    exists: true // Asegura que el campo email exista y no esté vacío
  },
  password: {
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    },
    exists: true // Asegura que el campo password exista y no esté vacío
  }
}

module.exports = validaciones;