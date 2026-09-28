const mongoose = require('mongoose');

// Slides del carrusel principal de la home: contenido promocional fijo, sin
// fecha de vencimiento (a diferencia de Promotion, que sí maneja descuentos
// con fecha). El CTA de cada slide es un link de WhatsApp con mensaje propio.
const heroSlideSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true, trim: true },
    subtitulo: { type: String, default: '', trim: true },
    imagen: { type: String, required: true },
    mensajeWhatsApp: { type: String, required: true, trim: true },
    orden: { type: Number, default: 0 },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

heroSlideSchema.index({ orden: 1 });

module.exports = mongoose.model('HeroSlide', heroSlideSchema);
