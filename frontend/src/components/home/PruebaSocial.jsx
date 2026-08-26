import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';

const WHATSAPP_URL = 'https://wa.link/s1krfl';

const STATS = [
  { label: 'Años de trayectoria', valor: '+40' },
  { label: 'Clientes felices en Tucumán', valor: '+500' },
];

export default function PruebaSocial() {
  return (
    <FadeInSection className="bg-sol-negro py-14 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-10 mb-10">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display font-black text-4xl text-sol-amarillo">{s.valor}</p>
              <p className="text-sm text-sol-blanco/70">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div whileHover={{ y: -4 }} className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-7 flex flex-col">
            <span className="w-12 h-12 rounded-full bg-sol-amarillo text-sol-negro flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M14 2v6h6" />
                <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
                <path d="M9 15l2 2 4-4" />
              </svg>
            </span>
            <h3 className="font-display font-black text-xl uppercase mb-2">Pedí tu presupuesto</h3>
            <p className="text-sm text-sol-blanco/70 mb-6">
              Subí una foto o PDF de tu receta oftalmológica y te contactamos con el presupuesto
              de tus lentes, sin moverte de tu casa.
            </p>
            <Link
              to="/subir-receta"
              className="mt-auto inline-flex items-center gap-2 rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-5 py-2.5 w-fit hover:brightness-95 transition"
            >
              Subir mi receta →
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -4 }} className="rounded-xl2 bg-sol-rojo p-7 flex flex-col">
            <span className="w-12 h-12 rounded-full bg-sol-negro flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-6 h-6">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.81.48 3.53 1.32 5.02L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.14c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11a15.9 15.9 0 0 1-1.63-.6c-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.53.33.07.12.07.71-.17 1.39Z" />
              </svg>
            </span>
            <h3 className="font-display font-black text-xl uppercase mb-2">Envíos a todo Tucumán</h3>
            <p className="text-sm text-sol-blanco/90 mb-6">
              Comprá desde donde estés. Consultanos el costo y el tiempo de envío a tu domicilio
              por WhatsApp.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 rounded-full bg-sol-negro text-sol-blanco font-display font-bold px-5 py-2.5 w-fit hover:bg-black transition"
            >
              Consultar envío →
            </a>
          </motion.div>
        </div>
      </div>
    </FadeInSection>
  );
}
