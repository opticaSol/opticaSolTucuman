const mongoose = require('mongoose');

// Documento único: siempre se opera sobre el primero que exista.
const promoMessageSchema = new mongoose.Schema(
  {
    texto: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PromoMessage', promoMessageSchema);
