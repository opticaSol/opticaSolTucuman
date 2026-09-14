import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import CountdownTimer from '../ui/CountdownTimer';

export default function HeroPromoCarousel({ promotions = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (promotions.length < 2) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % promotions.length), 6000);
    return () => clearInterval(interval);
  }, [promotions.length]);

  if (!promotions.length) {
    return (
      <div className="relative h-[70vh] min-h-[420px] w-full bg-sol-negro flex items-center justify-center">
        <p className="font-display text-sol-amarillo">Cargando promociones...</p>
      </div>
    );
  }

  const promo = promotions[index];

  return (
    <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-sol-negro">
      <AnimatePresence mode="wait">
        <motion.div
          key={promo._id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <motion.img
            src={promo.bannerImagen}
            alt={promo.titulo}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6, ease: 'linear' }}
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-sol-negro via-sol-negro/50 to-sol-negro/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-sol-negro/60 via-transparent to-sol-negro/60" />

          {/* Resplandor decorativo, eco del sunburst de marca */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-sol-amarillo/10 blur-3xl pointer-events-none" />

          <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-6 pb-16 md:pb-20 gap-4">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-sol-rojo/90 text-sol-blanco text-xs font-display font-bold uppercase tracking-wider px-4 py-1.5"
            >
              ● Oferta activa
            </motion.span>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-display font-black text-4xl md:text-6xl text-sol-blanco uppercase drop-shadow-lg leading-[0.95]"
            >
              {promo.titulo}
            </motion.h1>
            <p className="max-w-xl text-sol-blanco/80">{promo.descripcion}</p>
            {promo.fechaFin && <CountdownTimer endDate={promo.fechaFin} />}
            <Link
              to="/?enPromocion=true#catalogo"
              className="group mt-2 inline-flex items-center gap-2 rounded-full bg-sol-amarillo text-sol-negro font-display font-extrabold px-8 py-3.5 hover:brightness-95 transition shadow-card"
            >
              Ver promo
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>

      {promotions.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + promotions.length) % promotions.length)}
            aria-label="Promo anterior"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sol-negro/50 hover:bg-sol-negro/80 text-sol-blanco items-center justify-center backdrop-blur transition"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % promotions.length)}
            aria-label="Promo siguiente"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sol-negro/50 hover:bg-sol-negro/80 text-sol-blanco items-center justify-center backdrop-blur transition"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {promotions.map((p, i) => (
              <button
                key={p._id}
                onClick={() => setIndex(i)}
                aria-label={`Ir a la promo ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-8 bg-sol-amarillo' : 'w-1.5 bg-sol-blanco/40 hover:bg-sol-blanco/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
