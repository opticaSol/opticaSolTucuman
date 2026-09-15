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
  if (body.categoria === 'recetados' && !body.tipoLenteRecetado) {
    return 'El tipo de lente recetado es obligatorio';
  }
  return null;
}

function validateMedia(body) {
  const imagenes = body.imagenes?.length || 0;
  const videos = body.videos?.length || 0;
  if (imagenes + videos === 0) {
    return 'El producto necesita al menos una imagen o video';
  }
  return null;
}

async function listProducts(req, res, next) {
  try {
    const {
      categoria,
      genero,
      tipoContacto,
      tipoLenteRecetado,
      marca,
      colorArmazon,
      precioMin,
      precioMax,
      enPromocion,
      irrompible,
      destacado,
      q,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { activo: true };

    if (categoria) filter.categoria = categoria;
    if (genero) filter.subcategoriaGenero = genero;
    if (tipoContacto) filter.tipoContacto = tipoContacto;
    if (tipoLenteRecetado) filter.tipoLenteRecetado = tipoLenteRecetado;
    if (marca) filter.marca = marca;
    if (colorArmazon) filter.colorArmazon = colorArmazon;
    if (irrompible === 'true') filter.irrompible = true;
    if (destacado === 'true') filter.destacado = true;

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
      nombre: { $ne: 'Producto sin nombre' },
    }).limit(4);
    res.json(related.map(serializeProduct));
  } catch (err) {
    next(err);
  }
}

async function listFilterOptions(req, res, next) {
  try {
    const [marcas, coloresArmazon] = await Promise.all([
      Product.distinct('marca', { activo: true, marca: { $ne: 'Sin marca' } }),
      Product.distinct('colorArmazon', {
        activo: true,
        marca: { $ne: 'Sin marca' },
        colorArmazon: { $ne: '' },
      }),
    ]);
    res.json({ marcas: marcas.sort(), coloresArmazon: coloresArmazon.sort() });
  } catch (err) {
    next(err);
  }
}

async function adminListProducts(req, res, next) {
  try {
    const {
      q,
      categoria,
      genero,
      tipoContacto,
      tipoLenteRecetado,
      marca,
      colorArmazon,
      precioMin,
      precioMax,
      enPromocion,
      irrompible,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (categoria) filter.categoria = categoria;
    if (genero) filter.subcategoriaGenero = genero;
    if (tipoContacto) filter.tipoContacto = tipoContacto;
    if (tipoLenteRecetado) filter.tipoLenteRecetado = tipoLenteRecetado;
    if (marca) filter.marca = marca;
    if (colorArmazon) filter.colorArmazon = colorArmazon;
    if (irrompible === 'true') filter.irrompible = true;
    if (precioMin || precioMax) {
      filter.precio = {};
      if (precioMin) filter.precio.$gte = Number(precioMin);
      if (precioMax) filter.precio.$lte = Number(precioMax);
    }
    if (enPromocion === 'true') {
      filter.precioDescuento = { $ne: null, $exists: true };
      filter.$expr = { $lt: ['$precioDescuento', '$precio'] };
    }
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

    const mediaError = validateMedia(req.body);
    if (mediaError) return res.status(400).json({ message: mediaError });

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

    const mediaError = validateMedia(req.body);
    if (mediaError) return res.status(400).json({ message: mediaError });

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

const CATEGORIAS_VALIDAS = ['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes'];

// Crea un producto "borrador" por cada archivo (nombre/marca/precio de
// relleno) para no tener que dar de alta uno por uno cuando se cargan muchas
// fotos o videos juntos. Quedan activos (visibles en el catálogo) de una.
async function bulkCreateProducts(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const { imagenes = [], videos = [], categoria = 'sol' } = req.body;

    const archivos = [
      ...(Array.isArray(imagenes) ? imagenes : []).map((url) => ({ url, tipo: 'imagen' })),
      ...(Array.isArray(videos) ? videos : []).map((url) => ({ url, tipo: 'video' })),
    ];

    if (archivos.length === 0) {
      return res.status(400).json({ message: 'Subí al menos una imagen o video' });
    }
    if (!CATEGORIAS_VALIDAS.includes(categoria)) {
      return res.status(400).json({ message: 'Categoría inválida' });
    }

    const productos = await Product.insertMany(
      archivos.map(({ url, tipo }) => ({
        nombre: 'Producto sin nombre',
        categoria,
        marca: 'Sin marca',
        precio: 0,
        stock: 0,
        imagenes: tipo === 'imagen' ? [url] : [],
        videos: tipo === 'video' ? [url] : [],
        activo: true,
      }))
    );

    res.status(201).json({ creados: productos.length, productos: productos.map(serializeProduct) });
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
  bulkCreateProducts,
};
