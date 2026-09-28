// Número de la tienda en formato internacional sin "+" (ej: 549381XXXXXXX).
// Configurable por variable de entorno; si no está seteada, usa el número
// real de la óptica como valor por defecto.
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5493815497586';

export function buildProductWhatsAppMessage(product) {
  const variante = product?.marca && product.marca !== 'Sin marca' ? ` - ${product.marca}` : '';
  const nombre = product?.nombre === 'Producto sin nombre' ? 'este producto' : product?.nombre;
  return `Hola Óptica Sol! Quiero consultar por: ${nombre}${variante}`;
}

export function buildWhatsAppLink(mensaje = '') {
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : '';
  return `https://wa.me/${WHATSAPP_NUMBER}${texto}`;
}

export function buildProductWhatsAppLink(product) {
  return buildWhatsAppLink(buildProductWhatsAppMessage(product));
}

// Para mandar a un número arbitrario (ej. un cliente de la lista del super
// admin), a diferencia de buildWhatsAppLink que siempre apunta al número fijo
// de la tienda.
export function buildWhatsAppLinkTo(numero, mensaje = '') {
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : '';
  return `https://wa.me/${numero}${texto}`;
}

// Reemplaza {nombre} en la plantilla del mensaje de promo del super admin.
export function fillPromoTemplate(texto, nombre) {
  return (texto || '').replaceAll('{nombre}', nombre || '');
}
