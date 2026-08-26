const mongoose = require('mongoose');

const recetaSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    contacto: { type: String, required: true, trim: true },
    comentario: { type: String, default: '' },
    archivoUrl: { type: String, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'contactado', 'cotizado', 'descartado'],
      default: 'pendiente',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Receta', recetaSchema);
