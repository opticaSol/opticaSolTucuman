export const STORE_WHATSAPP_URL = 'https://wa.link/s1krfl';

// Normaliza un teléfono argentino a formato wa.me (549 + código de área + número).
export function buildWhatsAppLink(telefono, mensaje = '') {
  if (!telefono) return null;

  let digits = String(telefono).replace(/\D/g, '');
  if (!digits) return null;

  if (digits.startsWith('54')) {
    digits = digits.slice(2);
  }
  if (digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  if (digits.startsWith('15')) {
    digits = digits.slice(2);
  }
  if (!digits.startsWith('9')) {
    digits = `9${digits}`;
  }

  const numero = `54${digits}`;
  const texto = mensaje ? `?text=${encodeURIComponent(mensaje)}` : '';
  return `https://wa.me/${numero}${texto}`;
}
