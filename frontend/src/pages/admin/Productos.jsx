import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchAdminProducts,
  deleteProduct,
  uploadImage,
  bulkCreateProducts,
  fetchFilterOptions,
} from '../../lib/api';
import { formatPrice, CATEGORIA_LABEL } from '../../lib/formatters';
import Pagination from '../../components/ui/Pagination';
import FiltrosChips from '../../components/catalogo/FiltrosChips';

const LIMIT = 10;

const FILTROS_INICIALES = {
  categoria: '',
  genero: '',
  tipoLenteRecetado: '',
  marca: '',
  colorArmazon: '',
  precioMin: '',
  precioMax: '',
  enPromocion: false,
  irrompible: false,
  q: '',
};

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(FILTROS_INICIALES);
  const [filterOptions, setFilterOptions] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bulkUploading, setBulkUploading] = useState(false);
  const bulkInputRef = useRef(null);

  function setFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function toggleFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? '' : value }));
  }

  function resetFilters() {
    setFilters(FILTROS_INICIALES);
  }

  useEffect(() => {
    fetchFilterOptions().then(setFilterOptions).catch(() => setFilterOptions(null));
  }, []);

  const q = filters.q;

  function load() {
    setLoading(true);
    fetchAdminProducts({
      ...filters,
      enPromocion: filters.enPromocion || undefined,
      page,
      limit: LIMIT,
    })
      .then((data) => {
        setProducts(data.items);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timer = setTimeout(load, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  async function handleDelete(product) {
    const result = await Swal.fire({
      title: '¿Eliminar producto?',
      text: product.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D32027',
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    if (!result.isConfirmed) return;

    await deleteProduct(product._id);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Producto eliminado',
      showConfirmButton: false,
      timer: 1500,
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    load();
  }

  async function handleBulkUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setBulkUploading(true);
    try {
      const imagenes = [];
      for (const file of files) {
        const { url } = await uploadImage(file, 'productos');
        imagenes.push(url);
      }

      const { creados } = await bulkCreateProducts({ categoria: filters.categoria || 'sol', imagenes });

      Swal.fire({
        icon: 'success',
        title: `Se crearon ${creados} productos`,
        text: 'Ya quedaron activos y visibles en el catálogo, con nombre, marca y precio de relleno. Entrá a cada uno para completar los datos reales cuanto antes.',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
      });
      setPage(1);
      load();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos crear los productos',
        text: err.response?.data?.message || 'Intentá de nuevo en unos minutos',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    } finally {
      setBulkUploading(false);
      if (bulkInputRef.current) bulkInputRef.current.value = '';
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display font-black text-2xl uppercase">Productos</h1>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-full border border-dashed border-sol-blanco/30 px-4 py-2 text-sm cursor-pointer hover:border-sol-amarillo">
            {bulkUploading ? 'Subiendo...' : 'Carga masiva de fotos'}
            <input
              ref={bulkInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleBulkUpload}
              disabled={bulkUploading}
              className="hidden"
            />
          </label>
          <Link
            to="/admin/productos/nuevo"
            className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-4 py-2 text-sm"
          >
            + Nuevo producto
          </Link>
        </div>
      </div>
      <p className="text-xs text-sol-blanco/50 -mt-4">
        La carga masiva crea un producto por foto en la categoría que tengas filtrada abajo (o
        "Anteojos de Sol" si no filtraste ninguna), activo de una (visible en el catálogo) con
        datos de relleno. Completá nombre, marca, precio y stock de cada uno apenas puedas.
      </p>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={q}
        onChange={(e) => setFilter('q', e.target.value)}
        className="w-full max-w-sm rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo"
      />

      <FiltrosChips
        filters={filters}
        onToggle={toggleFilter}
        onChange={setFilter}
        onReset={resetFilters}
        filterOptions={filterOptions}
      />

      {loading ? (
        <p className="text-sol-blanco/50 text-center py-6">Cargando...</p>
      ) : products.length === 0 ? (
        <p className="text-sol-blanco/50 text-center py-6">No hay productos.</p>
      ) : (
        <>
          {/* Mobile: tarjetas */}
          <div className="flex flex-col gap-3 md:hidden">
            {products.map((p) => (
              <div key={p._id} className="rounded-xl2 border border-sol-blanco/10 p-4 flex gap-3">
                <img
                  src={p.imagenes?.[0]}
                  alt=""
                  className="w-16 h-16 rounded-lg object-cover bg-sol-blanco/5 shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <p className="font-display font-bold leading-tight">{p.nombre}</p>
                  <p className="text-xs text-sol-blanco/50">{CATEGORIA_LABEL[p.categoria]}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span>{formatPrice(p.precio)}</span>
                    <span className={p.stock <= p.umbralStockBajo ? 'text-sol-rojo font-bold' : 'text-sol-blanco/70'}>
                      Stock: {p.stock}
                    </span>
                  </div>
                  <span
                    className={`w-fit text-xs font-display font-bold px-2 py-0.5 rounded-full ${
                      p.activo ? 'bg-sol-amarillo/20 text-sol-amarillo' : 'bg-sol-blanco/10 text-sol-blanco/50'
                    }`}
                  >
                    {p.activo ? 'Activo' : 'Inactivo'}
                  </span>
                  <div className="flex gap-4 pt-1">
                    <Link
                      to={`/admin/productos/${p._id}`}
                      className="text-sol-amarillo hover:underline text-xs font-bold"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-sol-rojo hover:underline text-xs font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden md:block overflow-x-auto rounded-xl2 border border-sol-blanco/10">
            <table className="w-full text-sm">
              <thead className="bg-sol-blanco/5 text-left text-xs uppercase text-sol-blanco/50">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoría</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-t border-sol-blanco/10">
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img src={p.imagenes?.[0]} alt="" className="w-10 h-10 rounded object-cover bg-sol-blanco/5" />
                      {p.nombre}
                    </td>
                    <td className="px-4 py-3 text-sol-blanco/70">{CATEGORIA_LABEL[p.categoria]}</td>
                    <td className="px-4 py-3">{formatPrice(p.precio)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock <= p.umbralStockBajo ? 'text-sol-rojo font-bold' : ''}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${
                          p.activo ? 'bg-sol-amarillo/20 text-sol-amarillo' : 'bg-sol-blanco/10 text-sol-blanco/50'
                        }`}
                      >
                        {p.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/productos/${p._id}`}
                        className="text-sol-amarillo hover:underline text-xs font-bold mr-4"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-sol-rojo hover:underline text-xs font-bold"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
