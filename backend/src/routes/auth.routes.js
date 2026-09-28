const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { login, getMe, updateMe } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth');
const { NOMBRE_REGEX, NOMBRE_REGEX_MSG, TELEFONO_REGEX, TELEFONO_REGEX_MSG } = require('../utils/validationPatterns');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiados intentos de inicio de sesión. Esperá unos minutos e intentá de nuevo.' },
});

const loginValidation = [
  body('email').trim().isEmail().withMessage('Ingresá un email válido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria').isLength({ max: 72 }),
];

const updateMeValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres')
    .matches(NOMBRE_REGEX)
    .withMessage(NOMBRE_REGEX_MSG),
  body('telefono')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('El teléfono es demasiado largo')
    .matches(TELEFONO_REGEX)
    .withMessage(TELEFONO_REGEX_MSG),
  body('direccion').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('La dirección es demasiado larga'),
];

router.post('/login', loginLimiter, loginValidation, login);
router.get('/me', protect, getMe);
router.put('/me', protect, updateMeValidation, updateMe);

module.exports = router;
