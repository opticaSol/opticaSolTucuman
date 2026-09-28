const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, unique: true, trim: true },
    aceptaPromos: { type: Boolean, default: true },
    ultimoContacto: { type: Date, default: null },
  },
  { timestamps: true }
);

clientSchema.index({ nombre: 'text', whatsapp: 'text' });

module.exports = mongoose.model('Client', clientSchema);
