import { AnimatePresence, motion } from 'framer-motion';
import PriceTag from '../ui/PriceTag';

export default function StickyAddToCart({ product, visible, onAdd }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed left-0 right-0 bottom-16 md:bottom-0 z-30 bg-sol-negro border-t border-sol-blanco/10 px-4 py-3"
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-display font-bold">{product.nombre}</p>
              <PriceTag precio={product.precio} precioDescuento={product.precioDescuento} />
            </div>
            <motion.button
              onClick={onAdd}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-5 py-2.5"
            >
              Agregar
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
