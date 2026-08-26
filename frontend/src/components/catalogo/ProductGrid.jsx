import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading, onQuickView }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl2 bg-sol-blanco/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="py-20 text-center text-sol-blanco/60 font-display">
        No encontramos productos con esos filtros. Probá ajustarlos.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onQuickView={onQuickView} />
      ))}
    </div>
  );
}
