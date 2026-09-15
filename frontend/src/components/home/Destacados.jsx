import { useEffect, useState } from 'react';
import { fetchProducts } from '../../lib/api';
import ProductCard from '../catalogo/ProductCard';
import FadeInSection from '../ui/FadeInSection';

export default function Destacados() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProducts({ destacado: true, limit: 8 })
      .then((data) => setProductos(data.items))
      .catch(() => setProductos([]));
  }, []);

  if (!productos.length) return null;

  return (
    <FadeInSection className="bg-sol-negro py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <p className="font-display font-bold text-sol-amarillo uppercase tracking-[0.2em] text-xs mb-2 text-center">
          Elegidos para vos
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase mb-8 text-center">
          Destacados
        </h2>

        <div className="relative">
          <div className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-none pb-2 -mx-6 px-6 md:mx-0 md:px-0">
            {productos.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                className="w-[70%] sm:w-[280px] shrink-0 self-start"
                imageFit="cover"
              />
            ))}
          </div>
          <div className="hidden md:block absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-sol-negro to-transparent pointer-events-none" />
        </div>
      </div>
    </FadeInSection>
  );
}
