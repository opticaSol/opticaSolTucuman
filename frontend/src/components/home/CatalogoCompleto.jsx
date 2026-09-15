import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchFilterOptions } from '../../lib/api';
import { useFilterStore } from '../../store/useFilterStore';
import { CATEGORIA_LABEL } from '../../lib/formatters';
import FiltrosChips from '../catalogo/FiltrosChips';
import ProductCard from '../catalogo/ProductCard';
import ProductGrid from '../catalogo/ProductGrid';
import Pagination from '../ui/Pagination';

const CATEGORIAS = Object.keys(CATEGORIA_LABEL);

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
  armazones: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="2" y="8" width="8" height="8" rx="2" />
      <rect x="14" y="8" width="8" height="8" rx="2" />
      <path d="M10 11h4M2 10 1 8M22 10l1-2" />
    </svg>
  ),
  liquidos: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M8 2h8M9 2v6l-5 10a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3L15 8V2" />
      <path d="M6 15h12" />
    </svg>
  ),
  colgantes: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M8 3c-3 2-4 6-2 9l6 9 6-9c2-3 1-7-2-9" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  ),
};

export default function CatalogoCompleto() {
  const [searchParams] = useSearchParams();
  const { filters, setFilter, toggleFilter, resetFilters } = useFilterStore();
  const [products, setProducts] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterOptions, setFilterOptions] = useState(null);

  const agrupado = !filters.categoria;

  useEffect(() => {
    const categoria = searchParams.get('categoria');
    const enPromocion = searchParams.get('enPromocion');
    const marca = searchParams.get('marca');
    if (categoria) setFilter('categoria', categoria);
    if (enPromocion) setFilter('enPromocion', true);
    if (marca) setFilter('marca', marca);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    fetchFilterOptions().then(setFilterOptions).catch(() => setFilterOptions(null));
  }, []);

  const baseParams = {
    ...filters,
    categoria: undefined,
    enPromocion: filters.enPromocion || undefined,
  };

  const load = useCallback(
    (targetPage) => {
      if (agrupado) return;
      setLoading(true);
      fetchProducts({
        ...filters,
        enPromocion: filters.enPromocion || undefined,
        page: targetPage,
        limit: 12,
      })
        .then((data) => {
          setProducts(data.items);
          setTotalPages(data.totalPages);
          setPage(data.page);
        })
        .finally(() => setLoading(false));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters, agrupado]
  );

  useEffect(() => {
    if (agrupado) return;
    load(1);
  }, [load, agrupado]);

  useEffect(() => {
    if (!agrupado) return;
    setLoading(true);
    Promise.all(
      CATEGORIAS.map((categoria) =>
        fetchProducts({ ...baseParams, categoria, limit: 8 }).then((data) => [categoria, data.items])
      )
    )
      .then((entries) => setGroupedProducts(Object.fromEntries(entries)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agrupado, filters.marca, filters.colorArmazon, filters.precioMin, filters.precioMax, filters.enPromocion, filters.irrompible, filters.q]);

  return (
    <section id="catalogo" className="bg-sol-negro py-16 px-6 scroll-mt-16">
      <div className="max-w-7xl mx-auto">
        <p className="font-display font-bold text-sol-amarillo uppercase tracking-[0.2em] text-xs mb-2 text-center">
          Todo lo que tenemos
        </p>
        <h2 className="font-display font-black text-3xl md:text-4xl uppercase mb-8 text-center">
          Catálogo
        </h2>

        <FiltrosChips
          filters={filters}
          onToggle={toggleFilter}
          onChange={setFilter}
          onReset={resetFilters}
          filterOptions={filterOptions}
        />

        {agrupado ? (
          <div className="mt-10 flex flex-col gap-14">
            {loading && Object.keys(groupedProducts).length === 0 ? (
              <p className="text-sol-blanco/60 text-center py-10">Cargando...</p>
            ) : (
              CATEGORIAS.map((categoria) => {
                const items = groupedProducts[categoria];
                if (!items?.length) return null;
                return (
                  <div key={categoria}>
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-sol-amarillo/15 text-sol-amarillo flex items-center justify-center">
                          {CATEGORIA_ICON[categoria]}
                        </span>
                        <h3 className="font-display font-extrabold text-2xl uppercase">
                          {CATEGORIA_LABEL[categoria]}
                        </h3>
                      </div>
                      <button
                        onClick={() => setFilter('categoria', categoria)}
                        className="text-sm font-display font-bold text-sol-amarillo hover:underline whitespace-nowrap"
                      >
                        Ver todo →
                      </button>
                    </div>
                    <div className="relative">
                      <div className="flex gap-4 overflow-x-auto overflow-y-hidden scrollbar-none pb-2 -mx-6 px-6 md:mx-0 md:px-0">
                        {items.map((p) => (
                          <ProductCard
                            key={p._id}
                            product={p}
                            className="w-[70%] sm:w-[280px] shrink-0 self-start"
                          />
                        ))}
                      </div>
                      <div className="hidden md:block absolute right-0 top-0 bottom-2 w-16 bg-gradient-to-l from-sol-negro to-transparent pointer-events-none" />
                    </div>
                  </div>
                );
              })
            )}
            {!loading && Object.values(groupedProducts).every((items) => !items?.length) && (
              <p className="text-sol-blanco/60 text-center py-10">
                No encontramos productos con esos filtros. Probá ajustarlos.
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="mt-6">
              <ProductGrid products={products} loading={loading} />
            </div>

            <div className="mt-8">
              <Pagination page={page} totalPages={totalPages} onChange={load} />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
