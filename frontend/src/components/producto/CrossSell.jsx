import ProductCard from '../catalogo/ProductCard';

export default function CrossSell({ products }) {
  if (!products?.length) return null;

  return (
    <section className="mt-12">
      <h2 className="font-display font-extrabold text-xl uppercase mb-4">
        Otros productos que pueden interesarte
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
