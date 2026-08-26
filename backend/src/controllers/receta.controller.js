const { validationResult } = require('express-validator');
const cloudinary = require('../config/cloudinary');
const Receta = require('../models/Receta');

function streamUpload(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

async function createReceta(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Adjuntá una foto o PDF de tu receta' });
    }

    const { nombre, contacto, comentario = '' } = req.body;
    const result = await streamUpload(req.file.buffer, 'opticasol/recetas');

    const receta = await Receta.create({
      nombre,
      contacto,
      comentario,
      archivoUrl: result.secure_url,
    });

    res.status(201).json({
      message: 'Recibimos tu receta, te vamos a contactar con el presupuesto',
      receta,
    });
  } catch (err) {
    next(err);
  }
}

async function adminListRecetas(req, res, next) {
  try {
    const { estado, page = 1, limit = 9 } = req.query;
    const filter = {};
    if (estado) filter.estado = estado;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Receta.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Receta.countDocuments(filter),
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

async function adminUpdateRecetaEstado(req, res, next) {
  try {
    const { estado } = req.body;
    const ESTADOS_VALIDOS = ['pendiente', 'contactado', 'cotizado', 'descartado'];

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const receta = await Receta.findByIdAndUpdate(req.params.id, { estado }, { new: true });
    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    res.json(receta);
  } catch (err) {
    next(err);
  }
}

async function adminUpdateReceta(req, res, next) {
  try {
    const { nombre, contacto, comentario } = req.body;

    if (nombre !== undefined && !String(nombre).trim()) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }
    if (contacto !== undefined && !String(contacto).trim()) {
      return res.status(400).json({ message: 'El contacto es obligatorio' });
    }

    const receta = await Receta.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }

    if (nombre !== undefined) receta.nombre = String(nombre).trim();
    if (contacto !== undefined) receta.contacto = String(contacto).trim();
    if (comentario !== undefined) receta.comentario = String(comentario).trim();

    await receta.save();
    res.json(receta);
  } catch (err) {
    next(err);
  }
}

async function adminDeleteReceta(req, res, next) {
  try {
    const receta = await Receta.findById(req.params.id);
    if (!receta) {
      return res.status(404).json({ message: 'Receta no encontrada' });
    }
    await receta.deleteOne();
    res.json({ message: 'Receta eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createReceta,
  adminListRecetas,
  adminUpdateReceta,
  adminDeleteReceta,
  adminUpdateRecetaEstado,
};
