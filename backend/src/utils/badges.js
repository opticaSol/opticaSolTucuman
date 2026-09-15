const NUEVO_DIAS = 21;
const MAS_VENDIDO_MIN_VENTAS = 15;

function calcularBadges(product) {
  const badges = [];

  const diasDesdeCreacion =
    (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  if (diasDesdeCreacion <= NUEVO_DIAS) {
    badges.push('Nuevo');
  }

  if (product.ventasCount >= MAS_VENDIDO_MIN_VENTAS) {
    badges.push('Más vendido');
  }

  // Se puede comprar aunque no haya stock (se pide al proveedor), así que no hay
  // badge de "Agotado": solo se avisa cuando quedan pocas unidades en stock real.
  if (product.stock > 0 && product.stock <= product.umbralStockBajo) {
    badges.push('Últimas unidades');
  }

  if (product.precioDescuento && product.precioDescuento < product.precio) {
    const porcentaje = Math.round(
      ((product.precio - product.precioDescuento) / product.precio) * 100
    );
    badges.push(`-${porcentaje}%`);
  }

  return badges;
}

module.exports = { calcularBadges };
