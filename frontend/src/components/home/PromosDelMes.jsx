import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FadeInSection from '../ui/FadeInSection';
import { formatDescuento } from '../../lib/formatters';

export default function PromosDelMes({ promotions = [] }) {
  if (!promotions.length) return null;

  return (
    <FadeInSection id="promos" className="bg-sol-amarillo py-16 px-6 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <p className="font-display font-bold text-sol-negro/60 uppercase tracking-[0.2em] text-xs mb-2 text-center">
          Por tiempo limitado
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl text-sol-negro uppercase mb-10 text-center">
          Promos del mes
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {promotions.map((promo, i) => (
            <motion.div
              key={promo._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              whileHover={{ y: -6 }}
            >
              <Link
                to="/?enPromocion=true#catalogo"
                className="group relative rounded-xl2 overflow-hidden shadow-card aspect-[4/3] block border-2 border-sol-negro"
              >
                <img
                  src={promo.bannerImagen}
                  alt={promo.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sol-negro/90 via-sol-negro/30 to-transparent" />
                <div className="absolute bottom-0 p-5 w-full">
                  <span className="inline-block bg-sol-rojo text-sol-blanco text-xs font-display font-bold px-3 py-1 rounded-full mb-2 uppercase">
                    {formatDescuento(promo)}
                  </span>
                  <h3 className="font-display font-extrabold text-lg text-sol-blanco leading-tight">
                    {promo.titulo}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs font-display font-bold text-sol-amarillo mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Ver promo <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            to="/?enPromocion=true#catalogo"
            className="inline-flex items-center gap-2 rounded-full bg-sol-negro text-sol-blanco font-display font-bold px-6 py-3 hover:bg-black transition"
          >
            Ver todas las promos →
          </Link>
        </div>
      </div>
    </FadeInSection>
  );
}
