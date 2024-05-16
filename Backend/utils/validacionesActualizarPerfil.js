const validaciones = {
  nombreCompleto: {
    optional: {
      options: { nullable: true }
    },
    matches: {
      options: /^[A-Za-z\s]+$/,
      errorMessage: 'El nombre no debe estar vacío, contener números ni caracteres especiales',
      bail: true
    }
  },
  usuario: {
    optional: {
      options: { nullable: true }
    },
    isLength: {
      options: {
        min: 5,
        max: 15,
      },
      errorMessage: 'El nombre de usuario debe tener entre 5 y 15 caracteres'
    },
    matches: {
      options: /^\S+$/,
      errorMessage: 'El nombre de usuario no debe estar vacío ni contener espacios',
      bail: true
    }
  }
};

module.exports = validaciones;