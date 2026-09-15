import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MENSAJES = [
  '3 y 6 cuotas sin interés con todas las tarjetas',
  'Lunes a Sábados',
  '40 años cuidando tu vista en Tucumán',
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MENSAJES.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-sol-rojo text-sol-blanco text-center text-xs sm:text-sm font-display font-bold py-2 px-4 overflow-hidden h-8 flex items-center justify-center">
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="block"
        >
          {MENSAJES[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
