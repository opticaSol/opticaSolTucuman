import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Badge from '../ui/Badge';
import PriceTag from '../ui/PriceTag';
import { useCartStore } from '../../store/useCartStore';
import { STORE_WHATSAPP_URL } from '../../lib/whatsapp';

export default function ProductCard({ product, className = '' }) {
  const addItem = useCartStore((s) => s.addItem);
  // Carga masiva sin completar todavía: mientras tenga el nombre de relleno,
  // no hay ficha real que mostrar.
  const esBorrador = product.nombre === 'Producto sin nombre';

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Agregado al carrito',
      text: product.nombre,
      showConfirmButton: false,
      timer: 1800,
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
  }

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col rounded-xl2 border border-sol-blanco/10 shadow-card overflow-hidden ${
        esBorrador ? 'bg-sol-blanco' : 'bg-sol-negro'
      } ${className}`}
    >
      <Link to={`/producto/${product._id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-sol-blanco overflow-hidden">
          <img
            src={product.imagenes?.[0]}
            alt={product.nombre}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
          {!esBorrador && (
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {product.badges?.map((b) => (
                <Badge key={b} label={b} />
              ))}
            </div>
          )}
        </div>

        {/* Se reserva siempre este bloque (con o sin contenido) para que todas las
            tarjetas midan lo mismo, tengan o no ficha completa todavía. */}
        <div className="p-4 flex flex-col gap-1 flex-1 min-h-[104px]">
          {!esBorrador && (
            <>
              <span className="text-xs uppercase tracking-wide text-sol-blanco/50">
                {product.marca}
              </span>
              <h3 className="font-display font-bold leading-tight line-clamp-2">{product.nombre}</h3>
              <div className="mt-auto pt-2">
                <PriceTag precio={product.precio} precioDescuento={product.precioDescuento} />
              </div>
            </>
          )}
        </div>
      </Link>

      {esBorrador ? (
        <div className="m-4 mt-0 grid grid-cols-2 gap-2">
          <button
            disabled
            className="rounded-full font-display font-bold py-2 text-sm bg-sol-negro/10 text-sol-negro/40 cursor-not-allowed"
          >
            Precio a confirmar
          </button>
          <a
            href={STORE_WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="rounded-full font-display font-bold py-2 text-sm text-center bg-sol-amarillo text-sol-negro hover:brightness-95 transition-colors"
          >
            WhatsApp
          </a>
        </div>
      ) : (
        <motion.button
          onClick={handleAddToCart}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          className="m-4 mt-0 rounded-full font-display font-bold py-2 text-sm transition-colors bg-sol-amarillo text-sol-negro hover:brightness-95"
        >
          Agregar al carrito
        </motion.button>
      )}
    </motion.div>
  );
}
