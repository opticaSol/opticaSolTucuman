const express = require('express');
const { body } = require('express-validator');
const {
  createOrder,
  getOrder,
  deleteMyOrder,
  simulatePayment,
  webhook,
  listMyOrders,
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');
const { TELEFONO_REGEX, TELEFONO_REGEX_MSG } = require('../utils/validationPatterns');

const router = express.Router();

const createOrderValidation = [
  body('items').isArray({ min: 1 }).withMessage('El carrito está vacío'),
  body('items.*.productoId').notEmpty().withMessage('Falta el producto'),
  body('items.*.cantidad').optional().isInt({ min: 1, max: 999 }).withMessage('Cantidad inválida'),
  body('telefono')
    .trim()
    .notEmpty()
    .withMessage('Ingresá un teléfono de contacto válido')
    .isLength({ min: 6, max: 20 })
    .withMessage('Ingresá un teléfono de contacto válido')
    .matches(TELEFONO_REGEX)
    .withMessage(TELEFONO_REGEX_MSG),
];

router.post('/webhook', webhook);

router.post('/', protect, createOrderValidation, createOrder);
router.get('/mine', protect, listMyOrders);
router.get('/:id', protect, getOrder);
router.delete('/:id', protect, deleteMyOrder);
router.post('/:id/simular', protect, simulatePayment);

module.exports = router;
