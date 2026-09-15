import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';

const BENEFICIOS = [
  {
    titulo: 'Anteojos en 1 hora',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    titulo: 'Descuento en bar seleccionado',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 5h14l-1.5 12a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8Z" />
        <path d="M17 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-2.3" />
        <path d="M7 2v2M11 2v2" />
      </svg>
    ),
  },
  {
    titulo: 'Estacionamiento sin cargo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M9 16V8h3.5a2.5 2.5 0 0 1 0 5H9" />
      </svg>
    ),
  },
  {
    titulo: 'Descuento en tu próxima compra',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M20.59 13.41 12 22l-9-9V4h9Z" />
        <path d="M3 4l9 9" />
        <circle cx="7.5" cy="7.5" r="1.5" />
      </svg>
    ),
  },
  {
    titulo: 'Descuentos en cabañas en Tafí del Valle',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M3 20 10 6l4 7 3-4 4 11Z" />
      </svg>
    ),
  },
];

export default function BeneficiosRecetados() {
  return (
    <FadeInSection id="beneficios" className="bg-sol-amarillo py-16 px-6 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <p className="font-display font-bold text-sol-negro/60 uppercase tracking-[0.2em] text-xs mb-2 text-center">
          Comprando anteojos recetados
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl text-sol-negro uppercase mb-10 text-center">
          Estos son tus beneficios
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {BENEFICIOS.map((b, i) => (
            <motion.div
              key={b.titulo}
              whileHover={{ y: -6 }}
              className="relative rounded-xl2 bg-sol-negro text-sol-blanco p-6 pt-8 flex flex-col items-center gap-3 text-center"
            >
              <span className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-sol-rojo text-sol-blanco font-display font-black text-sm flex items-center justify-center border-2 border-sol-amarillo">
                {i + 1}
              </span>
              <span className="w-12 h-12 rounded-full bg-sol-amarillo text-sol-negro flex items-center justify-center">
                {b.icon}
              </span>
              <p className="font-display font-bold text-sm uppercase leading-tight">{b.titulo}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
