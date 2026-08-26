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

  if (product.stock === 0) {
    badges.push('Agotado');
  } else if (product.stock <= product.umbralStockBajo) {
    badges.push(`Últimas unidades`);
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
