import { formatPrice } from '../../lib/formatters';

export default function PriceTag({ precio, precioDescuento, size = 'md', mostrarPrecio = true }) {
  const textSize = size === 'lg' ? 'text-2xl' : 'text-lg';

  if (mostrarPrecio === false) {
    return <span className={`font-display font-bold text-sol-amarillo ${textSize}`}>Consultar precio</span>;
  }

  if (!precio) return null;

  const enPromocion = precioDescuento && precioDescuento < precio;

  if (!enPromocion) {
    return <span className={`font-display font-extrabold ${textSize}`}>{formatPrice(precio)}</span>;
  }

  return (
    <div className="flex items-baseline gap-2">
      <span className={`font-display font-extrabold text-sol-rojo ${textSize}`}>
        {formatPrice(precioDescuento)}
      </span>
      <span className="text-sm text-sol-blanco/50 line-through">{formatPrice(precio)}</span>
    </div>
  );
}
