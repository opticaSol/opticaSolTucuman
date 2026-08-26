import { Link } from 'react-router-dom';
import FadeInSection from '../ui/FadeInSection';
import ProductCard from '../catalogo/ProductCard';
import { CATEGORIA_LABEL } from '../../lib/formatters';

const CATEGORIA_ICON = {
  sol: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="5" />
      <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  ),
  contacto: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  recetados: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="6" cy="15" r="4" />
      <circle cx="18" cy="15" r="4" />
      <path d="M10 15h4M2 15l2-8h2M22 15l-2-8h-2" />
    </svg>
  ),
};

export default function DestacadosPorCategoria({ productsByCategory = {} }) {
  const categorias = Object.keys(CATEGORIA_LABEL);

  return (
    <div className="bg-sol-negro py-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        {categorias.map((categoria, i) => {
          const products = productsByCategory[categoria];
          if (!products?.length) return null;

          return (
            <FadeInSection key={categoria} delay={i * 0.1}>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-sol-amarillo/15 text-sol-amarillo flex items-center justify-center">
                    {CATEGORIA_ICON[categoria]}
                  </span>
                  <h2 className="font-display font-extrabold text-2xl uppercase">
                    {CATEGORIA_LABEL[categoria]}
                  </h2>
                </div>
                <Link
                  to={`/catalogo?categoria=${categoria}`}
                  className="text-sm font-display font-bold text-sol-amarillo hover:underline whitespace-nowrap"
                >
                  Ver todo →
                </Link>
              </div>
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto scrollbar-none pb-2 -mx-6 px-6 md:mx-0 md:px-0">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} className="min-w-[70%] sm:min-w-[280px]" />
                  ))}
                </div>
                <div className="hidden md:block absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-sol-negro to-transparent pointer-events-none" />
              </div>
            </FadeInSection>
          );
        })}
      </div>
    </div>
  );
}
