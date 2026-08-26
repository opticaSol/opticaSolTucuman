const { calcularBadges } = require('./badges');

function serializeProduct(productDoc) {
  const product = productDoc.toObject ? productDoc.toObject() : productDoc;
  return {
    ...product,
    enPromocion: Boolean(
      product.precioDescuento && product.precioDescuento < product.precio
    ),
    badges: calcularBadges(product),
  };
}

module.exports = { serializeProduct };
