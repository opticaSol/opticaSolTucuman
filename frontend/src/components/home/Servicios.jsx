import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';

const SERVICIOS = [
  {
    titulo: 'Foto carnet',
    detalle: 'Lo hacemos en el local',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    titulo: 'Foto para visa',
    detalle: 'Lo hacemos en el local',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 15l4.5-4.5a2 2 0 0 1 2.8 0L15 15M14 14l1.5-1.5a2 2 0 0 1 2.8 0L21 15" />
        <circle cx="8" cy="9" r="1.5" />
      </svg>
    ),
  },
];

export default function Servicios() {
  return (
    <FadeInSection id="servicios" className="bg-sol-negro py-16 px-6 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <p className="font-display font-bold text-sol-amarillo uppercase tracking-[0.2em] text-xs mb-2 text-center">
          Además, en Óptica Sol
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase mb-10 text-center">
          Fotos para trámites
        </h2>

        <div className="grid gap-5 sm:grid-cols-2 max-w-xl mx-auto">
          {SERVICIOS.map((s) => (
            <motion.div
              key={s.titulo}
              whileHover={{ y: -6 }}
              className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-6 text-center flex flex-col items-center gap-3"
            >
              <span className="w-14 h-14 rounded-full bg-sol-amarillo text-sol-negro flex items-center justify-center">
                {s.icon}
              </span>
              <h3 className="font-display font-bold text-sm uppercase">{s.titulo}</h3>
              <p className="text-xs text-sol-blanco/60">{s.detalle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
