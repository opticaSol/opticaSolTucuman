import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WhatsAppButton from '../ui/WhatsAppButton';

export default function HeroPromoCarousel({ slides = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const interval = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides.length) {
    return (
      <div className="relative h-[70vh] min-h-[420px] w-full bg-sol-negro flex items-center justify-center">
        <p className="font-display text-sol-amarillo">Cargando...</p>
      </div>
    );
  }

  const slide = slides[index];

  return (
    <div className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-sol-negro">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide._id}
          initial={{ opacity: 0, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <motion.img
            src={slide.imagen}
            alt={slide.titulo}
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
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="font-display font-black text-4xl md:text-6xl text-sol-blanco uppercase drop-shadow-lg leading-[0.95]"
            >
              {slide.titulo}
            </motion.h1>
            {slide.subtitulo && <p className="max-w-xl text-sol-blanco/80">{slide.subtitulo}</p>}
            <WhatsAppButton
              mensaje={slide.mensajeWhatsApp}
              label="Consultá por WhatsApp"
              size="lg"
              fullWidth={false}
              className="mt-2"
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            aria-label="Slide anterior"
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sol-negro/50 hover:bg-sol-negro/80 text-sol-blanco items-center justify-center backdrop-blur transition"
          >
            ‹
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % slides.length)}
            aria-label="Slide siguiente"
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-sol-negro/50 hover:bg-sol-negro/80 text-sol-blanco items-center justify-center backdrop-blur transition"
          >
            ›
          </button>
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s._id}
                onClick={() => setIndex(i)}
                aria-label={`Ir al slide ${i + 1}`}
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
