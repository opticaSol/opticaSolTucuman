import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Swal from 'sweetalert2';
import { quickAddClientSchema } from '../../schemas/clientSchema';
import { normalizeArgentinePhone } from '../../lib/phone';
import { buildWhatsAppLinkTo, fillPromoTemplate } from '../../lib/whatsapp';
import {
  fetchClients,
  createClient,
  updateClient,
  deleteClient,
  fetchPromoMessage,
} from '../../lib/api';
import Pagination from '../../components/ui/Pagination';

const LIMIT = 10;

const swalBase = {
  background: '#0D0D0D',
  color: '#FFFFFF',
};

function PromoSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label="Alternar aceptaPromos"
      className={`inline-flex items-center w-11 h-6 rounded-full p-0.5 transition-colors ${
        checked ? 'bg-sol-amarillo' : 'bg-sol-blanco/20'
      }`}
    >
      <span
        className={`w-5 h-5 rounded-full bg-sol-negro transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function Clientes() {
  const [clients, setClients] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [aceptaPromosFiltro, setAceptaPromosFiltro] = useState('');
  const [sort, setSort] = useState('nombre');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [promoTexto, setPromoTexto] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setFocus,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(quickAddClientSchema), defaultValues: { nombre: '', whatsapp: '' } });

  const whatsappValue = watch('whatsapp');
  const previewNormalizado = normalizeArgentinePhone(whatsappValue);

  function load() {
    setLoading(true);
    fetchClients({
      q: q || undefined,
      aceptaPromos: aceptaPromosFiltro || undefined,
      sort,
      page,
      limit: LIMIT,
    })
      .then((data) => {
        setClients(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [q, aceptaPromosFiltro, sort, page]);
  useEffect(() => {
    setPage(1);
  }, [q, aceptaPromosFiltro, sort]);

  useEffect(() => {
    fetchPromoMessage().then((data) => setPromoTexto(data.texto));
  }, []);

  async function onQuickAdd(values) {
    try {
      const client = await createClient(values);
      setClients((prev) => [client, ...prev]);
      setTotal((t) => t + 1);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cliente cargado',
        showConfirmButton: false,
        timer: 1200,
        ...swalBase,
      });
      reset({ nombre: '', whatsapp: '' });
      setFocus('nombre');
    } catch (err) {
      setError('whatsapp', { message: err.response?.data?.message || 'No se pudo cargar el cliente' });
    }
  }

  async function handleTogglePromos(client) {
    const nuevoValor = !client.aceptaPromos;
    setClients((prev) => prev.map((c) => (c._id === client._id ? { ...c, aceptaPromos: nuevoValor } : c)));
    try {
      await updateClient(client._id, { aceptaPromos: nuevoValor });
    } catch {
      setClients((prev) => prev.map((c) => (c._id === client._id ? { ...c, aceptaPromos: client.aceptaPromos } : c)));
    }
  }

  async function handleEdit(client) {
    const { value: formValues } = await Swal.fire({
      title: 'Editar cliente',
      html: `
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;">Nombre</label>
        <input id="swal-nombre" class="swal2-input" value="${client.nombre || ''}" placeholder="Nombre">
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;margin-top:8px;">WhatsApp</label>
        <input id="swal-whatsapp" class="swal2-input" value="${client.whatsapp || ''}" placeholder="WhatsApp" inputmode="tel">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#F5C518',
      cancelButtonColor: 'transparent',
      ...swalBase,
      preConfirm: () => {
        const nombre = document.getElementById('swal-nombre').value.trim();
        const whatsapp = document.getElementById('swal-whatsapp').value.trim();
        if (!nombre) {
          Swal.showValidationMessage('El nombre es obligatorio');
          return false;
        }
        if (!whatsapp) {
          Swal.showValidationMessage('El WhatsApp es obligatorio');
          return false;
        }
        return { nombre, whatsapp };
      },
    });

    if (!formValues) return;

    try {
      const updated = await updateClient(client._id, formValues);
      setClients((prev) => prev.map((c) => (c._id === client._id ? updated : c)));
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cliente actualizado',
        showConfirmButton: false,
        timer: 1500,
        ...swalBase,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo actualizar',
        text: err.response?.data?.message,
        confirmButtonColor: '#D32027',
        ...swalBase,
      });
    }
  }

  async function handleDelete(client) {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este cliente?',
      text: `"${client.nombre}" se va a borrar definitivamente.`,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D32027',
      cancelButtonColor: 'transparent',
      ...swalBase,
    });
    if (!confirm.isConfirmed) return;

    try {
      await deleteClient(client._id);
      setClients((prev) => prev.filter((c) => c._id !== client._id));
      setTotal((t) => t - 1);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Cliente eliminado',
        showConfirmButton: false,
        timer: 1500,
        ...swalBase,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text: err.response?.data?.message,
        confirmButtonColor: '#D32027',
        ...swalBase,
      });
    }
  }

  async function handleEnviar(client) {
    const mensaje = fillPromoTemplate(promoTexto, client.nombre);
    window.open(buildWhatsAppLinkTo(client.whatsapp, mensaje), '_blank', 'noopener,noreferrer');
    const ahora = new Date().toISOString();
    setClients((prev) => prev.map((c) => (c._id === client._id ? { ...c, ultimoContacto: ahora } : c)));
    try {
      await updateClient(client._id, { ultimoContacto: ahora });
    } catch {
      // El envío ya se abrió; si falla el registro de fecha no hace falta avisar.
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-black text-2xl uppercase">Clientes</h1>
        <span className="text-sm text-sol-blanco/60">
          <strong className="text-sol-amarillo">{total}</strong> cargados
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onQuickAdd)}
        className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5 flex flex-col sm:flex-row gap-3 sm:items-start"
      >
        <div className="flex-1">
          <input
            {...register('nombre')}
            placeholder="Nombre"
            autoComplete="off"
            className="input w-full"
          />
          {errors.nombre && <p className="text-xs text-sol-rojo mt-1">{errors.nombre.message}</p>}
        </div>

        <div className="flex-1">
          <input
            {...register('whatsapp')}
            type="tel"
            inputMode="tel"
            placeholder="WhatsApp (ej: 381 15-1234567)"
            autoComplete="off"
            className="input w-full"
          />
          {previewNormalizado && (
            <p className="text-xs text-sol-blanco/40 mt-1">Se guarda como: {previewNormalizado}</p>
          )}
          {errors.whatsapp && <p className="text-xs text-sol-rojo mt-1">{errors.whatsapp.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-6 py-2.5 disabled:opacity-50 whitespace-nowrap"
        >
          {isSubmitting ? 'Guardando...' : '+ Agregar'}
        </button>
      </form>

      <div className="flex flex-wrap gap-3 items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre o WhatsApp..."
          className="input flex-1 min-w-[200px]"
        />
        <select value={aceptaPromosFiltro} onChange={(e) => setAceptaPromosFiltro(e.target.value)} className="input">
          <option value="">Todos</option>
          <option value="true">Aceptan promos</option>
          <option value="false">No aceptan promos</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="input">
          <option value="nombre">Orden alfabético</option>
          <option value="-ultimoContacto">Último contacto</option>
        </select>
      </div>

      {loading ? (
        <p className="text-sol-blanco/60">Cargando...</p>
      ) : clients.length === 0 ? (
        <p className="text-sol-blanco/60">No hay clientes cargados todavía.</p>
      ) : (
        <>
          {/* Tabla en desktop */}
          <div className="hidden md:block overflow-x-auto rounded-xl2 border border-sol-blanco/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sol-blanco/10 text-left text-sol-blanco/50 text-xs uppercase">
                  <th className="p-3">Nombre</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Promos</th>
                  <th className="p-3">Último contacto</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c._id} className="border-b border-sol-blanco/5 hover:bg-sol-blanco/5">
                    <td className="p-3 font-display font-bold">{c.nombre}</td>
                    <td className="p-3 text-sol-blanco/70">{c.whatsapp}</td>
                    <td className="p-3">
                      <PromoSwitch checked={c.aceptaPromos} onChange={() => handleTogglePromos(c)} />
                    </td>
                    <td className="p-3 text-sol-blanco/50 text-xs">
                      {c.ultimoContacto ? new Date(c.ultimoContacto).toLocaleDateString('es-AR') : '—'}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-3 justify-end">
                        <button
                          onClick={() => handleEnviar(c)}
                          className="text-sol-rojo hover:underline text-xs font-bold whitespace-nowrap"
                        >
                          Enviar WhatsApp
                        </button>
                        <button onClick={() => handleEdit(c)} className="text-sol-amarillo hover:underline text-xs font-bold">
                          Editar
                        </button>
                        <button onClick={() => handleDelete(c)} className="text-sol-blanco/50 hover:underline text-xs font-bold">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tarjetas en mobile */}
          <div className="md:hidden flex flex-col gap-3">
            {clients.map((c) => (
              <div key={c._id} className="rounded-xl2 border border-sol-blanco/10 p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <p className="font-display font-bold">{c.nombre}</p>
                  <PromoSwitch checked={c.aceptaPromos} onChange={() => handleTogglePromos(c)} />
                </div>
                <p className="text-sm text-sol-blanco/70">{c.whatsapp}</p>
                <p className="text-xs text-sol-blanco/50">
                  Último contacto: {c.ultimoContacto ? new Date(c.ultimoContacto).toLocaleDateString('es-AR') : '—'}
                </p>
                <button
                  onClick={() => handleEnviar(c)}
                  className="rounded-full bg-sol-rojo text-sol-blanco font-display font-bold text-sm py-2.5 mt-1"
                >
                  Enviar WhatsApp
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(c)}
                    className="flex-1 rounded-full bg-sol-blanco/10 text-sol-blanco text-xs font-display font-bold px-3 py-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(c)}
                    className="flex-1 rounded-full bg-sol-blanco/10 text-sol-blanco/70 text-xs font-display font-bold px-3 py-2"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}
