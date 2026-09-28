const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const { NOMBRE_REGEX, NOMBRE_REGEX_MSG } = require('../utils/validationPatterns');
const {
  listClients,
  createClient,
  updateClient,
  deleteClient,
  getPromoMessage,
  updatePromoMessage,
  getSuperAdminDashboard,
} = require('../controllers/superadmin.controller');

const router = express.Router();

router.use(protect, authorize('superadmin'));

const clientValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre es demasiado largo')
    .matches(NOMBRE_REGEX)
    .withMessage(NOMBRE_REGEX_MSG),
  body('whatsapp').trim().notEmpty().withMessage('El WhatsApp es obligatorio'),
];

const clientUpdateValidation = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El nombre es demasiado largo')
    .matches(NOMBRE_REGEX)
    .withMessage(NOMBRE_REGEX_MSG),
  body('whatsapp').optional().trim().notEmpty().withMessage('El WhatsApp es obligatorio'),
  body('aceptaPromos').optional().isBoolean().withMessage('Formato inválido'),
];

const promoMessageValidation = [
  body('texto')
    .trim()
    .notEmpty()
    .withMessage('El mensaje es obligatorio')
    .isLength({ max: 1000 })
    .withMessage('El mensaje es demasiado largo (máximo 1000 caracteres)')
    .custom((value) => value.includes('{nombre}'))
    .withMessage('El mensaje tiene que incluir {nombre}'),
];

router.get('/dashboard', getSuperAdminDashboard);

router.get('/clientes', listClients);
router.post('/clientes', clientValidation, createClient);
router.put('/clientes/:id', clientUpdateValidation, updateClient);
router.delete('/clientes/:id', deleteClient);

router.get('/promo', getPromoMessage);
router.put('/promo', promoMessageValidation, updatePromoMessage);

module.exports = router;
