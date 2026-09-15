const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
      return cb(new Error('Solo se permiten imágenes o videos'));
    }
    cb(null, true);
  },
});

module.exports = upload;
