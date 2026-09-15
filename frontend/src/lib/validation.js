// Patrones compartidos por los schemas de zod. Nombres: solo letras (con
// acentos/ñ) y espacios, guiones o apóstrofes (para nombres compuestos).
// Teléfono: dígitos, espacios y los símbolos habituales (+, -, paréntesis).
export const NOMBRE_REGEX = /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/;
export const NOMBRE_REGEX_MSG = 'Solo puede tener letras y espacios';

export const TELEFONO_REGEX = /^[0-9+()\-\s]+$/;
export const TELEFONO_REGEX_MSG = 'Ingresá solo números (podés usar +, - o espacios)';
