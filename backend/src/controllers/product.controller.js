const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const { serializeProduct } = require('../utils/serializeProduct');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
}

function validateCategoryFields(body) {
  if (body.categoria === 'contacto') {
    if (!body.tipoContacto) return 'El tipo de lente de contacto es obligatorio';
  } else if (!body.subcategoriaGenero) {
    return 'El género/edad es obligatorio para sol y recetados';
  }
  return null;
}

async function listProducts(req, res, next) {
  try {
    const {
      categoria,
      genero,
      tipoContacto,
      marca,
      colorArmazon,
      precioMin,
      precioMax,
      enPromocion,
      q,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { activo: true };

    if (categoria) filter.categoria = categoria;
    if (genero) filter.subcategoriaGenero = genero;
    if (tipoContacto) filter.tipoContacto = tipoContacto;
    if (marca) filter.marca = marca;
    if (colorArmazon) filter.colorArmazon = colorArmazon;

    if (precioMin || precioMax) {
      filter.precio = {};
      if (precioMin) filter.precio.$gte = Number(precioMin);
      if (precioMax) filter.precio.$lte = Number(precioMax);
    }

    if (enPromocion === 'true') {
      filter.precioDescuento = { $ne: null, $exists: true };
      filter.$expr = { $lt: ['$precioDescuento', '$precio'] };
    }

    if (q) {
      filter.$text = { $search: q };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(48, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      items: items.map(serializeProduct),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      activo: true,
    });
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
}

async function listRelatedProducts(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const related = await Product.find({
      _id: { $ne: product._id },
      categoria: product.categoria,
      activo: true,
    }).limit(4);
    res.json(related.map(serializeProduct));
  } catch (err) {
    next(err);
  }
}

async function listFilterOptions(req, res, next) {
  try {
    const [marcas, coloresArmazon] = await Promise.all([
      Product.distinct('marca', { activo: true }),
      Product.distinct('colorArmazon', { activo: true, colorArmazon: { $ne: '' } }),
    ]);
    res.json({ marcas: marcas.sort(), coloresArmazon: coloresArmazon.sort() });
  } catch (err) {
    next(err);
  }
}

async function adminListProducts(req, res, next) {
  try {
    const { q, categoria, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (categoria) filter.categoria = categoria;
    if (q) filter.$text = { $search: q };

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(filter),
    ]);

    res.json({
      items: items.map(serializeProduct),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

async function adminGetProduct(req, res, next) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
}

async function createProduct(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const categoryError = validateCategoryFields(req.body);
    if (categoryError) return res.status(400).json({ message: categoryError });

    const product = await Product.create(req.body);
    res.status(201).json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const categoryError = validateCategoryFields(req.body);
    if (categoryError) return res.status(400).json({ message: categoryError });

    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    res.json(serializeProduct(product));
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listProducts,
  getProductById,
  listRelatedProducts,
  listFilterOptions,
  adminListProducts,
  adminGetProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
