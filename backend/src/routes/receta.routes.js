const express = require('express');
const { body } = require('express-validator');
const { createReceta } = require('../controllers/receta.controller');
const uploadReceta = require('../middleware/uploadReceta');

const router = express.Router();

const recetaValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('contacto')
    .trim()
    .notEmpty()
    .withMessage('Dejanos un email o teléfono de contacto')
    .isLength({ min: 6 })
    .withMessage('Ingresá un email o teléfono válido'),
];

router.post('/', uploadReceta.single('archivo'), recetaValidation, createReceta);

module.exports = router;
