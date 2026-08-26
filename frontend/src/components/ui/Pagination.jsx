import { motion } from 'framer-motion';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-3 pt-2">
      <motion.button
        whileHover={{ scale: page > 1 ? 1.05 : 1 }}
        whileTap={{ scale: page > 1 ? 0.95 : 1 }}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="rounded-full border border-sol-blanco/20 text-sol-blanco/80 font-display font-bold px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-sol-amarillo transition-colors"
      >
        ← Anterior
      </motion.button>

      <span className="text-sm text-sol-blanco/60">
        Página <strong className="text-sol-blanco">{page}</strong> de {totalPages}
      </span>

      <motion.button
        whileHover={{ scale: page < totalPages ? 1.05 : 1 }}
        whileTap={{ scale: page < totalPages ? 0.95 : 1 }}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="rounded-full border border-sol-blanco/20 text-sol-blanco/80 font-display font-bold px-4 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:border-sol-amarillo transition-colors"
      >
        Siguiente →
      </motion.button>
    </div>
  );
}
