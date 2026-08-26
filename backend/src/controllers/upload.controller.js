const cloudinary = require('../config/cloudinary');

function streamUpload(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    stream.end(buffer);
  });
}

async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ninguna imagen' });
    }

    const tipo = req.query.tipo === 'promos' ? 'promos' : 'productos';
    const result = await streamUpload(req.file.buffer, `opticasol/${tipo}`);

    res.status(201).json({ url: result.secure_url });
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadImage };
