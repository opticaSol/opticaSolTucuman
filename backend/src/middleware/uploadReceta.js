const multer = require('multer');

const uploadReceta = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const permitido = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
    if (!permitido) {
      return cb(new Error('Solo se permiten imágenes o archivos PDF'));
    }
    cb(null, true);
  },
});

module.exports = uploadReceta;
