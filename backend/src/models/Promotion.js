const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    descripcion: { type: String, default: '' },

    tipoDescuento: {
      type: String,
      enum: ['porcentaje', 'monto'],
      required: true,
    },
    valor: { type: Number, required: true, min: 0 },

    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, default: null },

    bannerImagen: { type: String, required: true },

    categoriasIncluidas: {
      type: [String],
      enum: ['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes'],
      default: [],
    },
    productosIncluidos: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    ],

    activa: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);
