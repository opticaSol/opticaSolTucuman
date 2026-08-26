import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import Badge from '../ui/Badge';
import PriceTag from '../ui/PriceTag';
import { useCartStore } from '../../store/useCartStore';

export default function QuickViewModal({ product, onClose }) {
  const addItem = useCartStore((s) => s.addItem);

  function handleAddToCart() {
    addItem(product, 1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Agregado al carrito',
      showConfirmButton: false,
      timer: 1800,
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    onClose();
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 p-0 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full md:max-w-2xl max-h-[90vh] overflow-y-auto bg-sol-negro border border-sol-blanco/10 rounded-t-xl2 md:rounded-xl2 shadow-card grid md:grid-cols-2"
          >
            <div className="relative aspect-square bg-sol-blanco/5">
              <img
                src={product.imagenes?.[0]}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.badges?.map((b) => (
                  <Badge key={b} label={b} />
                ))}
              </div>
            </div>

            <div className="p-6 flex flex-col gap-3">
              <button
                onClick={onClose}
                className="self-end text-sol-blanco/60 hover:text-sol-blanco text-sm"
              >
                Cerrar ✕
              </button>
              <span className="text-xs uppercase tracking-wide text-sol-blanco/50">
                {product.marca}
              </span>
              <h2 className="font-display font-extrabold text-xl">{product.nombre}</h2>
              <PriceTag precio={product.precio} precioDescuento={product.precioDescuento} size="lg" />
              <p className="text-sm text-sol-blanco/70">{product.descripcion}</p>

              <div className="mt-auto flex flex-col gap-2 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-40"
                >
                  {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
                </button>
                <Link
                  to={`/producto/${product._id}`}
                  onClick={onClose}
                  className="text-center text-sm font-display font-bold text-sol-amarillo underline underline-offset-4"
                >
                  Ver ficha completa
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
