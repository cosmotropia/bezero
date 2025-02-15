export const loginValidations = {
    email: {
      required: "El email es obligatorio",
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "El email no es válido",
      },
    },
    password: {
      required: "La contraseña es obligatoria",
      minLength: {
        value: 6,
        message: "La contraseña debe tener al menos 6 caracteres",
      },
    },
}

export const registerValidations = {
    fullName: {
      required: "El nombre completo es obligatorio",
    },
    address: {
      required: "La dirección es obligatoria",
    },
    email: {
      required: "El email es obligatorio",
      pattern: {
        value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        message: "Debe ser un email válido",
      },
    },
    phone: {
      required: "El teléfono es obligatorio",
      pattern: {
        value: /^[0-9]{10}$/,
        message: "El teléfono debe tener 10 dígitos",
      },
    },
    password: {
      required: "La contraseña es obligatoria",
      minLength: {
        value: 6,
        message: "La contraseña debe tener al menos 6 caracteres",
      },
    },
    confirmPassword: {
      required: "Repetir contraseña es obligatorio",
      validate: (value, { password }) =>
        value === password || "Las contraseñas no coinciden",
    },
    terms: {
      required: "Debes aceptar los términos y condiciones",
    },
    businessName: {
      required: "El nombre del comercio es obligatorio",
    },
    businessRUT: {
      required: "El RUT del comercio es obligatorio",
      pattern: {
        value: /^[0-9]{7,10}-[0-9kK]{1}$/,
        message: "El RUT no es válido",
      },
    },
    businessAddress: {
      required: "La dirección del comercio es obligatoria",
    },
    productImage: {
      required: "Debes subir una imagen de tus productos",
    },
}
  
export const publicationValidations = {
  nombre: {
    required: 'El nombre es obligatorio',
    minLength: {
      value: 3,
      message: 'El nombre debe tener al menos 3 caracteres',
    },
  },
  dias_recogida: {
    required: 'Los días de recogida son obligatorios',
  },
  hr_ini: {
    required: 'La hora de inicio es obligatoria',
  },
  hr_end: {
    required: 'La hora de término es obligatoria',
  },
  descripcion: {
    required: 'La descripción es obligatoria',
    minLength: {
      value: 10,
      message: 'La descripción debe tener al menos 10 caracteres',
    },
  },
  tipo: {
    required: 'El tipo es obligatorio',
  },
}
