const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },

    categoria: {
      type: String,
      required: true,
      enum: ['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes', 'cristales'],
    },
    // Requerido para 'sol' y 'armazones'
    subcategoriaGenero: {
      type: String,
      enum: ['dama', 'caballero', 'niños', null],
      default: null,
    },
    // Requerido para 'contacto'
    tipoContacto: {
      type: String,
      enum: ['diarias', 'mensuales', 'toricas', 'color', 'anual', null],
      default: null,
    },
    // Requerido para 'recetados'
    tipoLenteRecetado: {
      type: String,
      enum: ['multifocales', 'bifocales', 'ocupacionales', 'monofocales', null],
      default: null,
    },

    marca: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 },
    precioDescuento: { type: Number, min: 0, default: null },
    // Si es false, el catálogo muestra "Consultar precio" en vez del monto.
    mostrarPrecio: { type: Boolean, default: true },

    // Ya no bloquea nada (no hay compra online): queda como referencia
    // interna opcional para el admin.
    stock: { type: Number, min: 0, default: 0 },
    umbralStockBajo: { type: Number, min: 0, default: 5 },

    // La validación de "al menos una imagen o video" se hace en el
    // controller (bulkCreateProducts crea borradores solo-imagen o
    // solo-video a propósito, uno por cada archivo cargado).
    imagenes: { type: [String], default: [] },
    videos: { type: [String], default: [] },

    descripcion: { type: String, default: '' },
    materiales: { type: String, default: '' },
    proteccionUV: { type: Boolean, default: false },
    irrompible: { type: Boolean, default: false },
    colorArmazon: { type: String, default: '' },
    // Lentes de contacto blandas de uso anual (no descartables): dispara el
    // badge "Uso anual · No descartables" en el catálogo.
    usoAnual: { type: Boolean, default: false },

    ventasCount: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
    destacado: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ nombre: 'text', marca: 'text', descripcion: 'text' });
productSchema.index({ categoria: 1, subcategoriaGenero: 1, tipoContacto: 1, tipoLenteRecetado: 1 });

module.exports = mongoose.model('Product', productSchema);
