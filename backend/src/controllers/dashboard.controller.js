const Product = require('../models/Product');
const Promotion = require('../models/Promotion');
const { serializeProduct } = require('../utils/serializeProduct');

async function getDashboardStats(req, res, next) {
  try {
    const now = new Date();

    const [totalProductos, agotados, stockBajo, promocionesActivas] = await Promise.all([
      Product.countDocuments({ activo: true }),
      Product.find({ activo: true, stock: 0 }).sort({ nombre: 1 }),
      Product.find({
        activo: true,
        stock: { $gt: 0 },
        $expr: { $lte: ['$stock', '$umbralStockBajo'] },
      }).sort({ nombre: 1 }),
      Promotion.countDocuments({
        activa: true,
        fechaInicio: { $lte: now },
        $or: [{ fechaFin: null }, { fechaFin: { $gte: now } }],
      }),
    ]);

    res.json({
      totalProductos,
      promocionesActivas,
      agotados: agotados.map(serializeProduct),
      stockBajo: stockBajo.map(serializeProduct),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats };
