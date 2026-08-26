const express = require('express');
const {
  createOrder,
  getOrder,
  deleteMyOrder,
  simulatePayment,
  webhook,
  listMyOrders,
} = require('../controllers/order.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/webhook', webhook);

router.post('/', protect, createOrder);
router.get('/mine', protect, listMyOrders);
router.get('/:id', protect, getOrder);
router.delete('/:id', protect, deleteMyOrder);
router.post('/:id/simular', protect, simulatePayment);

module.exports = router;
