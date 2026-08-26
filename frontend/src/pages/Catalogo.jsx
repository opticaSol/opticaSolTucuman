import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchProducts, fetchFilterOptions } from '../lib/api';
import { useFilterStore } from '../store/useFilterStore';
import FiltrosChips from '../components/catalogo/FiltrosChips';
import ProductGrid from '../components/catalogo/ProductGrid';
import QuickViewModal from '../components/catalogo/QuickViewModal';
import PageTransition from '../components/ui/PageTransition';

export default function Catalogo() {
  const [searchParams] = useSearchParams();
  const { filters, setFilter, toggleFilter } = useFilterStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState(null);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    const categoria = searchParams.get('categoria');
    const enPromocion = searchParams.get('enPromocion');
    if (categoria) setFilter('categoria', categoria);
    if (enPromocion) setFilter('enPromocion', true);
  }, [searchParams, setFilter]);

  useEffect(() => {
    fetchFilterOptions().then(setFilterOptions).catch(() => setFilterOptions(null));
  }, []);

  const load = useCallback(
    (targetPage) => {
      setLoading(true);
      fetchProducts({
        ...filters,
        enPromocion: filters.enPromocion || undefined,
        page: targetPage,
        limit: 12,
      })
        .then((data) => {
          setProducts((prev) => (targetPage === 1 ? data.items : [...prev, ...data.items]));
          setTotalPages(data.totalPages);
          setPage(data.page);
        })
        .finally(() => setLoading(false));
    },
    [filters]
  );

  useEffect(() => {
    load(1);
  }, [load]);

  return (
    <PageTransition className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="font-display font-black text-3xl uppercase mb-6">Catálogo</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filters.q}
          onChange={(e) => setFilter('q', e.target.value)}
          className="w-full rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-5 py-3 focus:outline-none focus:border-sol-amarillo"
        />
      </div>

      <FiltrosChips
        filters={filters}
        onToggle={toggleFilter}
        onChange={setFilter}
        filterOptions={filterOptions}
      />

      <div className="mt-6">
        <ProductGrid products={products} loading={loading && page === 1} onQuickView={setQuickViewProduct} />
      </div>

      {!loading && page < totalPages && (
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => load(page + 1)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-full border border-sol-amarillo text-sol-amarillo font-display font-bold px-6 py-2.5 hover:bg-sol-amarillo hover:text-sol-negro transition-colors"
          >
            Ver más productos
          </motion.button>
        </div>
      )}

      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </PageTransition>
  );
}
