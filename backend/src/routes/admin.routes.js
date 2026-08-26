const express = require('express');
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const { getDashboardStats } = require('../controllers/dashboard.controller');
const { uploadImage } = require('../controllers/upload.controller');
const {
  adminListProducts,
  adminGetProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');
const {
  adminListPromotions,
  adminGetPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
} = require('../controllers/promotion.controller');
const {
  adminListOrders,
  adminUpdateOrder,
  adminDeleteOrder,
  adminUpdateOrderStatus,
} = require('../controllers/order.controller');
const {
  adminListRecetas,
  adminUpdateReceta,
  adminDeleteReceta,
  adminUpdateRecetaEstado,
} = require('../controllers/receta.controller');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);

const productValidation = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('categoria').isIn(['sol', 'contacto', 'recetados']).withMessage('Categoría inválida'),
  body('marca').trim().notEmpty().withMessage('La marca es obligatoria'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser mayor o igual a 0'),
  body('stock').isInt({ min: 0 }).withMessage('El stock debe ser mayor o igual a 0'),
  body('imagenes').isArray({ min: 1 }).withMessage('Necesitás al menos una imagen'),
];

router.get('/products', adminListProducts);
router.get('/products/:id', adminGetProduct);
router.post('/products', productValidation, createProduct);
router.put('/products/:id', productValidation, updateProduct);
router.delete('/products/:id', deleteProduct);

const promotionValidation = [
  body('titulo').trim().notEmpty().withMessage('El título es obligatorio'),
  body('tipoDescuento').isIn(['porcentaje', 'monto']).withMessage('Tipo de descuento inválido'),
  body('valor').isFloat({ min: 0 }).withMessage('El valor debe ser mayor o igual a 0'),
  body('fechaInicio').isISO8601().withMessage('Fecha de inicio inválida'),
  body('bannerImagen').trim().notEmpty().withMessage('El banner es obligatorio'),
];

router.get('/promotions', adminListPromotions);
router.get('/promotions/:id', adminGetPromotion);
router.post('/promotions', promotionValidation, createPromotion);
router.put('/promotions/:id', promotionValidation, updatePromotion);
router.delete('/promotions/:id', deletePromotion);

router.get('/orders', adminListOrders);
router.put('/orders/:id', adminUpdateOrder);
router.delete('/orders/:id', adminDeleteOrder);
router.put('/orders/:id/estado', adminUpdateOrderStatus);

router.get('/recetas', adminListRecetas);
router.put('/recetas/:id', adminUpdateReceta);
router.delete('/recetas/:id', adminDeleteReceta);
router.put('/recetas/:id/estado', adminUpdateRecetaEstado);

router.post('/uploads', upload.single('image'), uploadImage);

module.exports = router;
