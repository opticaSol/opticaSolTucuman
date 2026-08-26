const { validationResult } = require('express-validator');
const Promotion = require('../models/Promotion');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
}

async function listActivePromotions(req, res, next) {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      activa: true,
      fechaInicio: { $lte: now },
      $or: [{ fechaFin: null }, { fechaFin: { $gte: now } }],
    }).sort({ createdAt: -1, _id: -1 });
    res.json(promotions);
  } catch (err) {
    next(err);
  }
}

async function adminListPromotions(req, res, next) {
  try {
    const { page = 1, limit = 9 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Promotion.find({})
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Promotion.countDocuments({}),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

async function adminGetPromotion(req, res, next) {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.json(promotion);
  } catch (err) {
    next(err);
  }
}

async function createPromotion(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    if (req.body.fechaFin && new Date(req.body.fechaFin) < new Date(req.body.fechaInicio)) {
      return res.status(400).json({ message: 'La fecha de fin no puede ser anterior al inicio' });
    }

    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (err) {
    next(err);
  }
}

async function updatePromotion(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    if (req.body.fechaFin && new Date(req.body.fechaFin) < new Date(req.body.fechaInicio)) {
      return res.status(400).json({ message: 'La fecha de fin no puede ser anterior al inicio' });
    }

    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }

    res.json(promotion);
  } catch (err) {
    next(err);
  }
}

async function deletePromotion(req, res, next) {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.id);
    if (!promotion) {
      return res.status(404).json({ message: 'Promoción no encontrada' });
    }
    res.json({ message: 'Promoción eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listActivePromotions,
  adminListPromotions,
  adminGetPromotion,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
