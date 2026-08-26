const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true, min: 0 },
    cantidad: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: 'El pedido necesita al menos un producto',
      },
    },
    total: { type: Number, required: true, min: 0 },
    estado: {
      type: String,
      enum: ['pendiente_pago', 'pagado', 'en_preparacion', 'listo', 'entregado', 'cancelado'],
      default: 'pendiente_pago',
    },
    medioPago: { type: String, enum: ['mercadopago'], default: 'mercadopago' },
    mercadopago: {
      preferenceId: { type: String, default: null },
      paymentId: { type: String, default: null },
      simulado: { type: Boolean, default: false },
    },
    direccionEntrega: { type: String, default: '' },
    telefonoContacto: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
