import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';

const CashIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 6v0M18 18v0" />
  </svg>
);

const CardIcon = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const MEDIOS = [
  { titulo: 'Efectivo / Transferencia', detalle: '10% OFF', destacado: true, icon: CashIcon },
  { titulo: 'Tarjetas de crédito', detalle: '3 cuotas sin interés', icon: CardIcon },
  { titulo: 'Tarjetas de crédito', detalle: '6 cuotas sin interés', icon: CardIcon },
];

export default function MediosDePagoBanner() {
  return (
    <FadeInSection className="relative bg-sol-rojo py-16 px-6 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, #0D0D0D 0px, #0D0D0D 2px, transparent 2px, transparent 26px)',
        }}
      />
      <div className="relative max-w-7xl mx-auto">
        <p className="font-display font-bold text-sol-negro/70 uppercase tracking-[0.2em] text-xs mb-2 text-center">
          Comprá como quieras
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl text-sol-blanco uppercase mb-10 text-center">
          Medios de pago
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {MEDIOS.map((m, i) => (
            <motion.div
              key={m.titulo + m.detalle}
              whileHover={{ y: -6 }}
              className={`rounded-xl2 p-7 text-center shadow-card flex flex-col items-center gap-3 ${
                m.destacado ? 'bg-sol-amarillo text-sol-negro' : 'bg-sol-negro text-sol-blanco'
              }`}
            >
              <span
                className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  m.destacado ? 'bg-sol-negro text-sol-amarillo' : 'bg-sol-amarillo text-sol-negro'
                }`}
              >
                {m.icon}
              </span>
              <p className="font-display font-bold text-sm uppercase">{m.titulo}</p>
              <p className="font-display font-black text-2xl">{m.detalle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
