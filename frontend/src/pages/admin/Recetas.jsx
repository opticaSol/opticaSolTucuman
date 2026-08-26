import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchAdminRecetas, updateRecetaEstado, updateReceta, deleteReceta } from '../../lib/api';
import Pagination from '../../components/ui/Pagination';

const LIMIT = 9;

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'pendiente', label: 'Pendiente' },
  { value: 'contactado', label: 'Contactado' },
  { value: 'cotizado', label: 'Cotizado' },
  { value: 'descartado', label: 'Descartado' },
];

const ESTADO_STYLE = {
  pendiente: 'bg-sol-rojo/20 text-sol-rojo',
  contactado: 'bg-sol-amarillo/20 text-sol-amarillo',
  cotizado: 'bg-sol-amarillo/20 text-sol-amarillo',
  descartado: 'bg-sol-blanco/10 text-sol-blanco/50',
};

export default function Recetas() {
  const [recetas, setRecetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function load() {
    setLoading(true);
    fetchAdminRecetas({ ...(filtro ? { estado: filtro } : {}), page, limit: LIMIT })
      .then((data) => {
        setRecetas(data.items);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [filtro, page]);

  useEffect(() => {
    setPage(1);
  }, [filtro]);

  async function handleChangeEstado(receta, estado) {
    if (estado === receta.estado) return;

    const confirm = await Swal.fire({
      icon: 'question',
      title: '¿Cambiar el estado de la receta?',
      text: `"${receta.nombre}" pasará a "${ESTADOS.find((e) => e.value === estado)?.label}"`,
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      background: '#0D0D0D',
      color: '#FFFFFF',
      confirmButtonColor: '#F5C518',
      cancelButtonColor: 'transparent',
    });
    if (!confirm.isConfirmed) {
      setRecetas((prev) => [...prev]);
      return;
    }

    try {
      await updateRecetaEstado(receta._id, estado);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Estado actualizado',
        showConfirmButton: false,
        timer: 1500,
        background: '#0D0D0D',
        color: '#FFFFFF',
      });
      load();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: err.response?.data?.message,
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  async function handleEdit(receta) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar receta',
      html: `
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;">Nombre</label>
        <input id="swal-nombre" class="swal2-input" value="${receta.nombre || ''}" placeholder="Nombre">
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;margin-top:8px;">Contacto</label>
        <input id="swal-contacto" class="swal2-input" value="${receta.contacto || ''}" placeholder="Email o teléfono">
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;margin-top:8px;">Comentario</label>
        <textarea id="swal-comentario" class="swal2-textarea" placeholder="Comentario">${receta.comentario || ''}</textarea>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      background: '#0D0D0D',
      color: '#FFFFFF',
      confirmButtonColor: '#F5C518',
      cancelButtonColor: 'transparent',
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value.trim();
        const contacto = document.getElementById('swal-contacto').value.trim();
        const comentario = document.getElementById('swal-comentario').value.trim();
        if (!nombre) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return false;
        }
        if (!contacto) {
          Swal.showValidationMessage('El contacto es obligatorio');
          return false;
        }
        return { nombre, contacto, comentario };
      },
    });

    if (!formValues) return;

    try {
      await updateReceta(receta._id, formValues);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Receta actualizada',
        showConfirmButton: false,
        timer: 1500,
        background: '#0D0D0D',
        color: '#FFFFFF',
      });
      load();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: err.response?.data?.message,
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  async function handleDelete(receta) {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar esta receta?',
      text: `"${receta.nombre}" — esta acción es irreversible.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#0D0D0D',
      color: '#FFFFFF',
      confirmButtonColor: '#D32027',
      cancelButtonColor: 'transparent',
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteReceta(receta._id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Receta eliminada',
        showConfirmButton: false,
        timer: 1500,
        background: '#0D0D0D',
        color: '#FFFFFF',
      });
      load();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text: err.response?.data?.message,
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  const esPdf = (url) => url?.toLowerCase().endsWith('.pdf');

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-black text-2xl uppercase">Recetas / Presupuestos</h1>

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {ESTADOS.map((e) => (
          <button
            key={e.value}
            onClick={() => setFiltro(e.value)}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-display font-bold border transition ${
              filtro === e.value
                ? 'bg-sol-amarillo border-sol-amarillo text-sol-negro'
                : 'border-sol-blanco/20 text-sol-blanco/80 hover:border-sol-amarillo'
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-sol-blanco/60">Cargando...</p>
        ) : recetas.length === 0 ? (
          <p className="text-sol-blanco/60">No hay recetas.</p>
        ) : (
          recetas.map((receta) => (
            <div key={receta._id} className="rounded-xl2 border border-sol-blanco/10 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${ESTADO_STYLE[receta.estado]}`}>
                  {receta.estado}
                </span>
                <span className="text-xs text-sol-blanco/50">
                  {new Date(receta.createdAt).toLocaleDateString('es-AR')}
                </span>
              </div>

              <div>
                <p className="font-display font-bold">{receta.nombre}</p>
                <p className="text-sm text-sol-blanco/60">{receta.contacto}</p>
              </div>

              {receta.comentario && (
                <p className="text-sm text-sol-blanco/70 italic">"{receta.comentario}"</p>
              )}

              {esPdf(receta.archivoUrl) ? (
                <a
                  href={receta.archivoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-display font-bold text-sol-amarillo hover:underline"
                >
                  Ver PDF de la receta →
                </a>
              ) : (
                <a href={receta.archivoUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={receta.archivoUrl}
                    alt="Receta"
                    className="w-full h-40 object-cover rounded-lg border border-sol-blanco/10"
                  />
                </a>
              )}

              <select
                value={receta.estado}
                onChange={(e) => handleChangeEstado(receta, e.target.value)}
                className="mt-auto input"
              >
                {ESTADOS.filter((e) => e.value).map((e) => (
                  <option key={e.value} value={e.value}>
                    {e.label}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(receta)}
                  className="flex-1 rounded-full bg-sol-blanco/10 text-sol-blanco text-xs font-display font-bold px-3 py-2 hover:bg-sol-blanco/20 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(receta)}
                  className="flex-1 rounded-full bg-sol-rojo/15 text-sol-rojo text-xs font-display font-bold px-3 py-2 hover:bg-sol-rojo/25 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
