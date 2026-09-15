const cloudinary = require('../config/cloudinary');

function streamUpload(buffer, folder, options) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder, ...options }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo' });
    }

    const tipo = req.query.tipo === 'promos' ? 'promos' : 'productos';
    const esVideo = req.file.mimetype.startsWith('video/');
    // Los videos de celular (ej. .mov/HEVC de iPhone) no se reproducen en la
    // mayoría de los navegadores: los pasamos siempre a mp4/h264 al subirlos.
    const options = esVideo
      ? { resource_type: 'video', format: 'mp4', video_codec: 'h264' }
      : { resource_type: 'image' };
    const result = await streamUpload(req.file.buffer, `opticasol/${tipo}`, options);

    res.status(201).json({ url: result.secure_url, tipo: esVideo ? 'video' : 'imagen' });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadImage };
