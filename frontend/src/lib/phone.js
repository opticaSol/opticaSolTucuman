// Normaliza un teléfono argentino a formato wa.me: 549 + código de área + número,
// sin el "15" de celular. Acepta "0381 15...", "381 15...", "381...", "+54 9 381...".
// (Misma lógica que backend/src/utils/normalizePhone.js, para mostrar la
// vista previa en vivo antes de guardar.)
export function normalizeArgentinePhone(raw) {
  if (!raw) return '';

  let digits = String(raw).replace(/\D/g, '');
  if (!digits) return '';

  if (digits.startsWith('54')) digits = digits.slice(2);
  if (digits.startsWith('9')) digits = digits.slice(1);
  if (digits.startsWith('0')) digits = digits.slice(1);
  digits = digits.replace(/^(\d{2,4})15(\d{6,8})$/, '$1$2');

  return digits ? `549${digits}` : '';
}

export function isValidArgentinePhone(normalized) {
  return /^549\d{9,11}$/.test(normalized || '');
}
