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
  bulkCreateProducts,
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
const { NOMBRE_REGEX, NOMBRE_REGEX_MSG, TELEFONO_REGEX, TELEFONO_REGEX_MSG } = require('../utils/validationPatterns');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);

const productValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isLength({ max: 120 })
    .withMessage('El nombre es demasiado largo (máximo 120 caracteres)'),
  body('categoria')
    .isIn(['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes'])
    .withMessage('Categoría inválida'),
  body('marca')
    .trim()
    .notEmpty()
    .withMessage('La marca es obligatoria')
    .isLength({ max: 60 })
    .withMessage('La marca es demasiado larga (máximo 60 caracteres)'),
  body('precio').isFloat({ min: 0, max: 99999999 }).withMessage('El precio debe ser un número válido'),
  body('stock').isInt({ min: 0, max: 999999 }).withMessage('El stock debe ser un número entero válido'),
  body('imagenes').isArray().withMessage('Formato de imágenes inválido'),
  body('videos').optional().isArray().withMessage('Formato de videos inválido'),
  body('descripcion').optional({ checkFalsy: true }).trim().isLength({ max: 1000 }).withMessage('La descripción es demasiado larga'),
  body('materiales').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('Es demasiado largo'),
  body('colorArmazon').optional({ checkFalsy: true }).trim().isLength({ max: 60 }).withMessage('Es demasiado largo'),
];

const bulkProductValidation = [
  body('imagenes').optional().isArray().withMessage('Formato de imágenes inválido'),
  body('videos').optional().isArray().withMessage('Formato de videos inválido'),
  body('categoria')
    .optional()
    .isIn(['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes'])
    .withMessage('Categoría inválida'),
];

router.get('/products', adminListProducts);
router.get('/products/:id', adminGetProduct);
router.post('/products', productValidation, createProduct);
router.post('/products/bulk', bulkProductValidation, bulkCreateProducts);
router.put('/products/:id', productValidation, updateProduct);
router.delete('/products/:id', deleteProduct);

const promotionValidation = [
  body('titulo')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ max: 100 })
    .withMessage('El título es demasiado largo (máximo 100 caracteres)'),
  body('descripcion').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('La descripción es demasiado larga'),
  body('tipoDescuento').isIn(['porcentaje', 'monto']).withMessage('Tipo de descuento inválido'),
  body('valor').isFloat({ min: 0, max: 999999 }).withMessage('El valor debe ser un número válido'),
  body('fechaInicio').isISO8601().withMessage('Fecha de inicio inválida'),
  body('bannerImagen').trim().notEmpty().withMessage('El banner es obligatorio'),
];

router.get('/promotions', adminListPromotions);
router.get('/promotions/:id', adminGetPromotion);
router.post('/promotions', promotionValidation, createPromotion);
router.put('/promotions/:id', promotionValidation, updatePromotion);
router.delete('/promotions/:id', deletePromotion);

const orderUpdateValidation = [
  body('telefonoContacto')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 6, max: 20 })
    .withMessage('Ingresá un teléfono de contacto válido')
    .matches(TELEFONO_REGEX)
    .withMessage(TELEFONO_REGEX_MSG),
  body('direccionEntrega').optional({ checkFalsy: true }).trim().isLength({ max: 200 }).withMessage('La dirección es demasiado larga'),
];

const orderEstadoValidation = [
  body('estado')
    .isIn(['pagado', 'en_preparacion', 'listo', 'entregado', 'cancelado'])
    .withMessage('Estado inválido'),
];

router.get('/orders', adminListOrders);
router.put('/orders/:id', orderUpdateValidation, adminUpdateOrder);
router.delete('/orders/:id', adminDeleteOrder);
router.put('/orders/:id/estado', orderEstadoValidation, adminUpdateOrderStatus);

const recetaUpdateValidation = [
  body('nombre')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('El nombre debe tener entre 2 y 80 caracteres')
    .matches(NOMBRE_REGEX)
    .withMessage(NOMBRE_REGEX_MSG),
  body('contacto').optional().trim().isLength({ min: 6, max: 100 }).withMessage('Ingresá un contacto válido'),
  body('comentario').optional({ checkFalsy: true }).trim().isLength({ max: 500 }).withMessage('El comentario es demasiado largo'),
];

const recetaEstadoValidation = [
  body('estado').isIn(['pendiente', 'contactado', 'cotizado', 'descartado']).withMessage('Estado inválido'),
];

router.get('/recetas', adminListRecetas);
router.put('/recetas/:id', recetaUpdateValidation, adminUpdateReceta);
router.delete('/recetas/:id', adminDeleteReceta);
router.put('/recetas/:id/estado', recetaEstadoValidation, adminUpdateRecetaEstado);

router.post('/uploads', upload.single('image'), uploadImage);

module.exports = router;
