export function formatPrice(value) {
  if (value == null) return '';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0,
  }).format(value);
}

export const GENERO_LABEL = {
  dama: 'Dama',
  caballero: 'Caballero',
  niños: 'Niños',
};

export const CATEGORIA_LABEL = {
  sol: 'Anteojos de Sol',
  contacto: 'Lentes de Contacto',
  recetados: 'Lentes Recetados',
  armazones: 'Armazones de Receta',
  liquidos: 'Líquidos',
  colgantes: 'Colgantes',
};

export function formatDescuento(promo) {
  if (!promo.valor) return 'Oferta';
  return promo.tipoDescuento === 'porcentaje' ? `${promo.valor}% OFF` : `$${promo.valor} OFF`;
}

export const TIPO_CONTACTO_LABEL = {
  diarias: 'Diarias',
  mensuales: 'Mensuales',
  toricas: 'Tóricas',
  color: 'Color',
};

export const TIPO_LENTE_RECETADO_LABEL = {
  multifocales: 'Multifocales',
  bifocales: 'Bifocales',
  ocupacionales: 'Ocupacionales',
  monofocales: 'Monofocales',
};
