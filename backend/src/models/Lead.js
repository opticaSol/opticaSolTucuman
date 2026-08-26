const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    nombre: { type: String, default: '' },
    contacto: { type: String, required: true, trim: true },
    origen: { type: String, default: 'newsletter-popup' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Lead', leadSchema);
