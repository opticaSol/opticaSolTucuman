const express = require('express');
const { body } = require('express-validator');
const { createReceta } = require('../controllers/receta.controller');
const uploadReceta = require('../middleware/uploadReceta');
const { NOMBRE_REGEX, NOMBRE_REGEX_MSG } = require('../utils/validationPatterns');

const router = express.Router();

const recetaValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres')
    .matches(NOMBRE_REGEX)
    .withMessage(NOMBRE_REGEX_MSG),
  body('contacto')
    .trim()
    .notEmpty()
    .withMessage('Dejanos un email o teléfono de contacto')
    .isLength({ min: 6, max: 100 })
    .withMessage('Ingresá un email o teléfono válido'),
  body('comentario').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('El comentario es demasiado largo'),
];

router.post('/', uploadReceta.single('archivo'), recetaValidation, createReceta);

module.exports = router;
