import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { fetchAdminHeroSlides, deleteHeroSlide } from '../../lib/api';

export default function HeroSlides() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetchAdminHeroSlides()
      .then(setSlides)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(slide) {
    const result = await Swal.fire({
      title: '¿Eliminar slide?',
      text: slide.titulo,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D32027',
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    if (!result.isConfirmed) return;

    await deleteHeroSlide(slide._id);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Slide eliminado',
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
        <h1 className="font-display font-black text-2xl uppercase">Sección principal</h1>
        <Link
          to="/admin/hero-slides/nuevo"
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-4 py-2 text-sm"
        >
          + Nuevo slide
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {loading ? (
          <p className="text-sol-blanco/60">Cargando...</p>
        ) : slides.length === 0 ? (
          <p className="text-sol-blanco/60">No hay slides.</p>
        ) : (
          slides.map((slide) => (
            <div
              key={slide._id}
              className="rounded-xl2 border border-sol-blanco/10 overflow-hidden flex flex-col"
            >
              <img src={slide.imagen} alt={slide.titulo} className="h-32 w-full object-cover" />
              <div className="p-4 flex flex-col gap-2 flex-1">
                <span
                  className={`w-fit text-xs font-display font-bold px-2 py-0.5 rounded-full ${
                    slide.activo ? 'bg-sol-rojo/20 text-sol-rojo' : 'bg-sol-blanco/10 text-sol-blanco/50'
                  }`}
                >
                  {slide.activo ? 'Activo' : 'Inactivo'}
                </span>
                <p className="font-display font-bold">{slide.titulo}</p>
                <p className="text-xs text-sol-blanco/60">Orden: {slide.orden ?? 0}</p>
                <div className="mt-auto flex gap-4 pt-2">
                  <Link
                    to={`/admin/hero-slides/${slide._id}`}
                    className="text-sol-amarillo hover:underline text-xs font-bold"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(slide)}
                    className="text-sol-rojo hover:underline text-xs font-bold"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
