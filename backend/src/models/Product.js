const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },

    categoria: {
      type: String,
      required: true,
      enum: ['sol', 'contacto', 'recetados'],
    },
    // Requerido para 'sol' y 'recetados'
    subcategoriaGenero: {
      type: String,
      enum: ['dama', 'caballero', 'niños', null],
      default: null,
    },
    // Requerido para 'contacto'
    tipoContacto: {
      type: String,
      enum: ['diarias', 'mensuales', 'toricas', 'color', null],
      default: null,
    },

    marca: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    precioDescuento: { type: Number, min: 0, default: null },

    stock: { type: Number, required: true, min: 0, default: 0 },
    umbralStockBajo: { type: Number, min: 0, default: 5 },

    imagenes: {
      type: [String],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length >= 1,
        message: 'El producto necesita al menos una imagen',
      },
    },

    descripcion: { type: String, default: '' },
    materiales: { type: String, default: '' },
    proteccionUV: { type: Boolean, default: false },
    colorArmazon: { type: String, default: '' },

    ventasCount: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ nombre: 'text', marca: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1, subcategoriaGenero: 1, tipoContacto: 1 });

module.exports = mongoose.model('Product', productSchema);
