import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchAdminProducts, deleteProduct } from '../../lib/api';
import { formatPrice, CATEGORIA_LABEL } from '../../lib/formatters';
import Pagination from '../../components/ui/Pagination';

const LIMIT = 10;

export default function Productos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function load() {
    setLoading(true);
    fetchAdminProducts({ q, page, limit: LIMIT })
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
  }, [q, page]);

  useEffect(() => {
    setPage(1);
  }, [q]);

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

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl uppercase">Productos</h1>
        <Link
          to="/admin/productos/nuevo"
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-4 py-2 text-sm"
        >
          + Nuevo producto
        </Link>
      </div>

      <input
        type="text"
        placeholder="Buscar productos..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full max-w-sm rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo"
      />

      <div className="overflow-x-auto rounded-xl2 border border-sol-blanco/10">
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
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sol-blanco/50">
                  Cargando...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-sol-blanco/50">
                  No hay productos.
                </td>
              </tr>
            ) : (
              products.map((p) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
