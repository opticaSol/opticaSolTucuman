// Patrones compartidos por las cadenas de express-validator (equivalentes a
// frontend/src/lib/validation.js, para que el back rechace lo mismo que el
// front ya bloqueó, por si alguien pega la request directo).
const NOMBRE_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
const NOMBRE_REGEX_MSG = 'Solo puede tener letras y espacios';

const TELEFONO_REGEX = /^[0-9+()\-\s]+$/;
const TELEFONO_REGEX_MSG = 'Ingresá solo números (podés usar +, - o espacios)';

module.exports = { NOMBRE_REGEX, NOMBRE_REGEX_MSG, TELEFONO_REGEX, TELEFONO_REGEX_MSG };
