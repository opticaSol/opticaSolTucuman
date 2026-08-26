import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import Badge from '../ui/Badge';
import PriceTag from '../ui/PriceTag';
import { useCartStore } from '../../store/useCartStore';

export default function ProductCard({ product, onQuickView, className = '' }) {
  const addItem = useCartStore((s) => s.addItem);
  const agotado = product.stock === 0;

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (agotado) return;
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
      className={`group relative flex flex-col rounded-xl2 bg-sol-negro border border-sol-blanco/10 shadow-card overflow-hidden ${className}`}
    >
      <Link to={`/producto/${product._id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-sol-blanco/5 overflow-hidden">
          <img
            src={product.imagenes?.[0]}
            alt={product.nombre}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.badges?.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
          {onQuickView && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="absolute bottom-2 right-2 bg-sol-blanco text-sol-negro text-xs font-display font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Vista rápida
            </button>
          )}
        </div>

        <div className="p-4 flex flex-col gap-1 flex-1">
          <span className="text-xs uppercase tracking-wide text-sol-blanco/50">
            {product.marca}
          </span>
          <h3 className="font-display font-bold leading-tight line-clamp-2">{product.nombre}</h3>
          <div className="mt-auto pt-2">
            <PriceTag precio={product.precio} precioDescuento={product.precioDescuento} />
          </div>
        </div>
      </Link>

      <motion.button
        onClick={handleAddToCart}
        disabled={agotado}
        whileHover={{ scale: agotado ? 1 : 1.03 }}
        whileTap={{ scale: agotado ? 1 : 0.95 }}
        className={`m-4 mt-0 rounded-full font-display font-bold py-2 text-sm transition-colors ${
          agotado
            ? 'bg-sol-blanco/10 text-sol-blanco/40 cursor-not-allowed'
            : 'bg-sol-amarillo text-sol-negro hover:brightness-95'
        }`}
      >
        {agotado ? 'Agotado' : 'Agregar al carrito'}
      </motion.button>
    </motion.div>
  );
}
