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
  sol: 'Lentes de Sol',
  contacto: 'Lentes de Contacto',
  recetados: 'Lentes Recetados',
};

export const TIPO_CONTACTO_LABEL = {
  diarias: 'Diarias',
  mensuales: 'Mensuales',
  toricas: 'Tóricas',
  color: 'Color',
};
