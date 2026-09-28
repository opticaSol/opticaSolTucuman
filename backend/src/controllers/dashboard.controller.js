const Product = require('../models/Product');
const Promotion = require('../models/Promotion');

async function getDashboardStats(req, res, next) {
  try {
    const now = new Date();

    const [totalProductos, promocionesActivas] = await Promise.all([
      Product.countDocuments({ activo: true }),
      Promotion.countDocuments({
        activa: true,
        fechaInicio: { $lte: now },
        $or: [{ fechaFin: null }, { fechaFin: { $gte: now } }],
      }),
    ]);

    res.json({ totalProductos, promocionesActivas });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardStats };
