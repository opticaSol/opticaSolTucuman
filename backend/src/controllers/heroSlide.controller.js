const { validationResult } = require('express-validator');
const HeroSlide = require('../models/HeroSlide');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
}

async function listActiveHeroSlides(req, res, next) {
  try {
    const slides = await HeroSlide.find({ activo: true }).sort({ orden: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    next(err);
  }
}

async function adminListHeroSlides(req, res, next) {
  try {
    const slides = await HeroSlide.find({}).sort({ orden: 1, createdAt: 1 });
    res.json(slides);
  } catch (err) {
    next(err);
  }
}

async function adminGetHeroSlide(req, res, next) {
  try {
    const slide = await HeroSlide.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide no encontrado' });
    }
    res.json(slide);
  } catch (err) {
    next(err);
  }
}

async function createHeroSlide(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;
    const slide = await HeroSlide.create(req.body);
    res.status(201).json(slide);
  } catch (err) {
    next(err);
  }
}

async function updateHeroSlide(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const slide = await HeroSlide.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!slide) {
      return res.status(404).json({ message: 'Slide no encontrado' });
    }

    res.json(slide);
  } catch (err) {
    next(err);
  }
}

async function deleteHeroSlide(req, res, next) {
  try {
    const slide = await HeroSlide.findByIdAndDelete(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide no encontrado' });
    }
    res.json({ message: 'Slide eliminado' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listActiveHeroSlides,
  adminListHeroSlides,
  adminGetHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
};
