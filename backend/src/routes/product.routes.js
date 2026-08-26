const express = require('express');
const {
  listProducts,
  getProductById,
  listRelatedProducts,
  listFilterOptions,
} = require('../controllers/product.controller');

const router = express.Router();

router.get('/', listProducts);
router.get('/filtros/opciones', listFilterOptions);
router.get('/:id', getProductById);
router.get('/:id/relacionados', listRelatedProducts);

module.exports = router;
