import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';

const WHATSAPP_URL = 'https://wa.link/s1krfl';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=24+de+Septiembre+838+San+Miguel+de+Tucum%C3%A1n';
const STORE_PHOTO =
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=900&h=1000&fit=crop&auto=format&q=80';

function InfoRow({ icon, title, subtitle, action }) {
  return (
    <div className="flex items-center gap-4 rounded-full bg-sol-blanco/5 border border-sol-blanco/10 pl-3 pr-5 py-3 hover:border-sol-amarillo/50 transition-colors">
      <span className="shrink-0 w-11 h-11 rounded-full bg-sol-amarillo text-sol-negro flex items-center justify-center">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="font-display font-bold text-sm truncate">{title}</p>
        {subtitle && <p className="text-xs text-sol-blanco/60 truncate">{subtitle}</p>}
      </div>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </div>
  );
}

export default function MapaHorarios() {
  return (
    <FadeInSection className="relative bg-sol-negro py-20 px-6 overflow-hidden">
      {/* Sunburst decorativo, eco del logo */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 50, ease: 'linear' }}
        className="pointer-events-none absolute -right-40 -top-40 w-[560px] h-[560px] rounded-full opacity-[0.07]"
        style={{
          backgroundImage:
            'repeating-conic-gradient(#F5C518 0deg 9deg, transparent 9deg 18deg)',
        }}
      />

      <div className="relative max-w-7xl mx-auto grid gap-14 md:grid-cols-2 items-center">
        <div>
          <p className="font-display font-bold text-sol-amarillo uppercase tracking-[0.2em] text-xs mb-3">
            ★ Encontranos en Tucumán
          </p>
          <h2 className="font-display font-black text-4xl md:text-5xl uppercase mb-8 leading-[0.95]">
            Visitanos
            <br />
            <span className="text-sol-rojo">cuando quieras</span>
          </h2>

          <div className="flex flex-col gap-3 mb-6">
            <InfoRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              }
              title="24 de Septiembre 838"
              subtitle="San Miguel de Tucumán"
              action={
                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-display font-bold text-sol-amarillo hover:underline whitespace-nowrap"
                >
                  Cómo llegar →
                </a>
              }
            />
            <InfoRow
              icon={
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 3" />
                </svg>
              }
              title="Lun a Vie: 8 a 13 y 17 a 20:30 hs"
              subtitle="Sábados: 9 a 12 hs"
            />
          </div>

          <motion.a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-4 rounded-xl2 bg-sol-rojo px-6 py-5 shadow-card"
          >
            <span className="shrink-0 w-12 h-12 rounded-full bg-sol-negro flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="#FFFFFF" className="w-6 h-6">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.81.48 3.53 1.32 5.02L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.14c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11a15.9 15.9 0 0 1-1.63-.6c-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.53.33.07.12.07.71-.17 1.39Z" />
              </svg>
            </span>
            <span className="text-left">
              <span className="block font-display font-extrabold uppercase text-sm">
                Envíos a todo Tucumán
              </span>
              <span className="block text-sm text-sol-blanco/90">
                Consultá costo y tiempos por WhatsApp →
              </span>
            </span>
          </motion.a>
        </div>

        <div className="relative mx-auto md:mx-0 max-w-sm">
          <motion.div
            initial={{ rotate: -4 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="rounded-xl2 overflow-hidden shadow-card border-[6px] border-sol-amarillo bg-sol-amarillo aspect-[4/5]"
          >
            <img src={STORE_PHOTO} alt="Óptica Sol" className="w-full h-full object-cover rounded-lg" />
          </motion.div>

          <motion.div
            initial={{ rotate: 8, scale: 0.8, opacity: 0 }}
            whileInView={{ rotate: 8, scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.2 }}
            className="absolute -bottom-6 -left-6 bg-sol-rojo text-sol-blanco rounded-full w-28 h-28 flex flex-col items-center justify-center text-center shadow-card border-4 border-sol-negro"
          >
            <span className="font-display font-black text-2xl leading-none">+40</span>
            <span className="font-display font-bold text-[10px] uppercase leading-tight px-2">
              años en Tucumán
            </span>
          </motion.div>
        </div>
      </div>
    </FadeInSection>
  );
}
