const validaciones = {
  nombre: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'nombre' requerido.",
      bail: true
    },
    notEmpty: {
      errorMessage: 'Campo obligatorio',
      bail: true
    }
  },
  cantPersonas: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'cantPersonas' requerido.",
      bail: true
    },
    isNumeric: {
      errorMessage: "El parámetro cantPersonas debe ser un número.",
      bail: true
    }
  },
  cantRecetas: {
    exists: {
      errorMessage: `Formato inválido. Parámetro "cantRecetas" requerido.`,
      bail: true
    },
    isNumeric: {
      errorMessage: "El parámetro cantRecetas debe ser un número.",
      bail: true
    }
  },
  precio: {
    exists: {
      errorMessage: "Formato inválido. Parámetro 'precio' requerido.",
      bail: true
    },
    isNumeric: {
      errorMessage: "El parámetro precio debe ser un número.",
      bail: true
    }
  }
}
module.exports = validaciones;