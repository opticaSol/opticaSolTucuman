import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';
import WhatsAppButton from '../ui/WhatsAppButton';

const SERVICIOS = [
  {
    titulo: 'Todo tipo de cristales',
    detalle: 'Antirreflejo, Blue, HD, fotocromáticos y más',
    mensaje: 'Hola Óptica Sol! Quiero consultar por cristales para mis anteojos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 4h18l-2 6a7 7 0 0 1-14 0L3 4Z" />
        <path d="M8 4v3M16 4v3" />
      </svg>
    ),
  },
  {
    titulo: 'Repuestos para anteojos de sol',
    detalle: 'Varillas, plaquetas, cristales y más',
    mensaje: 'Hola Óptica Sol! Quiero consultar por repuestos para mis anteojos de sol.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-6.6 6.6a1.5 1.5 0 0 0 2.1 2.1l6.6-6.6a4 4 0 0 0 5.4-5.4L14 10 11 7Z" />
      </svg>
    ),
  },
  {
    titulo: 'Reparación de anteojos',
    detalle: 'Le damos una segunda vida a tus anteojos',
    mensaje: 'Hola Óptica Sol! Quiero consultar por la reparación de mis anteojos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M10 9V4l7 7-7 7v-5c-4 0-6 2-7 5 0-6 2-9 7-9Z" />
      </svg>
    ),
  },
  {
    titulo: 'Foto carnet',
    detalle: 'Lo hacemos en el local',
    mensaje: 'Hola Óptica Sol! Quiero consultar por sacarme la foto carnet.',
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
    mensaje: 'Hola Óptica Sol! Quiero consultar por sacarme la foto para visa.',
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
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase mb-10 text-center">
          Nuestros servicios
        </h2>

        <div className="flex flex-wrap justify-center gap-5 max-w-4xl mx-auto">
          {SERVICIOS.map((s) => (
            <motion.div
              key={s.titulo}
              whileHover={{ y: -6 }}
              className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-6 text-center flex flex-col items-center gap-3"
            >
              <span className="w-14 h-14 rounded-full bg-sol-amarillo text-sol-negro flex items-center justify-center">
                {s.icon}
              </span>
              <h3 className="font-display font-bold text-sm uppercase">{s.titulo}</h3>
              <p className="text-xs text-sol-blanco/60 flex-1">{s.detalle}</p>
              <WhatsAppButton mensaje={s.mensaje} label="Consultar" size="sm" fullWidth={false} />
            </motion.div>
          ))}
        </div>
      </div>
    </FadeInSection>
  );
}
