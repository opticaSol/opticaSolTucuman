const STYLES = {
  Nuevo: 'bg-sol-amarillo text-sol-negro',
  'Más vendido': 'bg-sol-blanco text-sol-negro',
  'Últimas unidades': 'bg-sol-rojo text-sol-blanco animate-pulse',
  Agotado: 'bg-sol-negro text-sol-blanco border border-sol-blanco/40',
};

export default function Badge({ label }) {
  const isDescuento = label.startsWith('-');
  const className = isDescuento
    ? 'bg-sol-rojo text-sol-blanco'
    : STYLES[label] || 'bg-sol-negro text-sol-blanco';

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-display font-bold uppercase tracking-wide shadow-card ${className}`}
    >
      {label}
    </span>
  );
}
