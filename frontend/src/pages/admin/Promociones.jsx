import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchAdminPromotions, deletePromotion } from '../../lib/api';
import { formatDescuento } from '../../lib/formatters';
import Pagination from '../../components/ui/Pagination';

const LIMIT = 6;

function estadoDe(promo) {
  const now = new Date();
  if (!promo.activa) return { label: 'Inactiva', className: 'bg-sol-blanco/10 text-sol-blanco/50' };
  if (promo.fechaFin && new Date(promo.fechaFin) < now) {
    return { label: 'Expirada', className: 'bg-sol-blanco/10 text-sol-blanco/50' };
  }
  if (new Date(promo.fechaInicio) > now) {
    return { label: 'Programada', className: 'bg-sol-amarillo/20 text-sol-amarillo' };
  }
  return { label: 'Vigente', className: 'bg-sol-rojo/20 text-sol-rojo' };
}

export default function Promociones() {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function load() {
    setLoading(true);
    fetchAdminPromotions({ page, limit: LIMIT })
      .then((data) => {
        setPromotions(data.items);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [page]);

  async function handleDelete(promo) {
    const result = await Swal.fire({
      title: '¿Eliminar promoción?',
      text: promo.titulo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D32027',
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    if (!result.isConfirmed) return;

    await deletePromotion(promo._id);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Promoción eliminada',
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
        <h1 className="font-display font-black text-2xl uppercase">Promociones</h1>
        <Link
          to="/admin/promociones/nueva"
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-4 py-2 text-sm"
        >
          + Nueva promoción
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-sol-blanco/60">Cargando...</p>
        ) : promotions.length === 0 ? (
          <p className="text-sol-blanco/60">No hay promociones.</p>
        ) : (
          promotions.map((promo) => {
            const estado = estadoDe(promo);
            return (
              <div
                key={promo._id}
                className="rounded-xl2 border border-sol-blanco/10 overflow-hidden flex flex-col"
              >
                <img src={promo.bannerImagen} alt={promo.titulo} className="h-32 w-full object-cover" />
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <span className={`w-fit text-xs font-display font-bold px-2 py-0.5 rounded-full ${estado.className}`}>
                    {estado.label}
                  </span>
                  <p className="font-display font-bold">{promo.titulo}</p>
                  <p className="text-xs text-sol-blanco/60">
                    {formatDescuento(promo)}
                  </p>
                  <div className="mt-auto flex gap-4 pt-2">
                    <Link
                      to={`/admin/promociones/${promo._id}`}
                      className="text-sol-amarillo hover:underline text-xs font-bold"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(promo)}
                      className="text-sol-rojo hover:underline text-xs font-bold"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
