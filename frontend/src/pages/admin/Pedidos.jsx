import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { fetchAdminOrders, updateOrderStatus, updateAdminOrder, deleteAdminOrder } from '../../lib/api';
import { formatPrice } from '../../lib/formatters';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import Pagination from '../../components/ui/Pagination';

const LIMIT = 10;

const ESTADOS = [
  { value: '', label: 'Todos' },
  { value: 'pendiente_pago', label: 'Pago pendiente' },
  { value: 'pagado', label: 'Pagado' },
  { value: 'en_preparacion', label: 'En preparación' },
  { value: 'listo', label: 'Listo' },
  { value: 'entregado', label: 'Entregado' },
  { value: 'cancelado', label: 'Cancelado' },
];

const ESTADO_STYLE = {
  pendiente_pago: 'bg-sol-blanco/10 text-sol-blanco/70',
  pagado: 'bg-sol-amarillo/20 text-sol-amarillo',
  en_preparacion: 'bg-sol-amarillo/20 text-sol-amarillo',
  listo: 'bg-sol-amarillo/20 text-sol-amarillo',
  entregado: 'bg-sol-amarillo/20 text-sol-amarillo',
  cancelado: 'bg-sol-rojo/20 text-sol-rojo',
};

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  function load() {
    setLoading(true);
    fetchAdminOrders({ ...(filtro ? { estado: filtro } : {}), page, limit: LIMIT })
      .then((data) => {
        setOrders(data.items);
        setTotalPages(data.totalPages);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, [filtro, page]);

  useEffect(() => {
    setPage(1);
  }, [filtro]);

  async function handleChangeEstado(order, estado) {
    if (estado === order.estado) return;

    const confirm = await Swal.fire({
      icon: 'question',
      title: '¿Cambiar el estado del pedido?',
      text: `Pedido #${order._id.slice(-6).toUpperCase()} pasará a "${ESTADOS.find((e) => e.value === estado)?.label}"`,
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      cancelButtonText: 'Cancelar',
      background: '#0D0D0D',
      color: '#FFFFFF',
      confirmButtonColor: '#F5C518',
      cancelButtonColor: 'transparent',
    });
    if (!confirm.isConfirmed) {
      setOrders((prev) => [...prev]);
      return;
    }

    try {
      await updateOrderStatus(order._id, estado);
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

  async function handleEdit(order) {
    const { value: formValues } = await Swal.fire({
      title: `Editar pedido #${order._id.slice(-6).toUpperCase()}`,
      html: `
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;">Teléfono de contacto</label>
        <input id="swal-telefono" class="swal2-input" value="${order.telefonoContacto || ''}" placeholder="Teléfono de contacto">
        <label style="display:block;text-align:left;font-size:12px;color:#ffffffaa;margin-bottom:4px;margin-top:8px;">Dirección de entrega</label>
        <input id="swal-direccion" class="swal2-input" value="${order.direccionEntrega || ''}" placeholder="Dirección de entrega">
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
        const telefono = document.getElementById('swal-telefono').value.trim();
        const direccion = document.getElementById('swal-direccion').value.trim();
        if (telefono.replace(/\D/g, '').length < 6) {
          Swal.showValidationMessage('Ingresá un teléfono válido');
          return false;
        }
        return { telefonoContacto: telefono, direccionEntrega: direccion };
      },
    });

    if (!formValues) return;

    try {
      await updateAdminOrder(order._id, formValues);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Pedido actualizado',
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

  async function handleDelete(order) {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar este pedido?',
      text:
        order.estado === 'pagado' || order.estado === 'entregado'
          ? `Pedido #${order._id.slice(-6).toUpperCase()} ya está ${order.estado === 'pagado' ? 'pagado' : 'entregado'}. Esta acción es irreversible y borra el registro definitivamente.`
          : `Pedido #${order._id.slice(-6).toUpperCase()}. Esta acción es irreversible.`,
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
      await deleteAdminOrder(order._id);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Pedido eliminado',
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display font-black text-2xl uppercase">Pedidos</h1>

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

      <div className="overflow-x-auto rounded-xl2 border border-sol-blanco/10">
        <table className="w-full text-sm">
          <thead className="bg-sol-blanco/5 text-left text-xs uppercase text-sol-blanco/50">
            <tr>
              <th className="px-4 py-3">Pedido</th>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sol-blanco/50">
                  Cargando...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-sol-blanco/50">
                  No hay pedidos.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order._id} className="border-t border-sol-blanco/10 align-top">
                  <td className="px-4 py-3 font-display font-bold">
                    #{order._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <p>{order.cliente?.nombre}</p>
                    <p className="text-xs text-sol-blanco/50">{order.cliente?.email}</p>
                  </td>
                  <td className="px-4 py-3 text-sol-blanco/70 max-w-xs">
                    {order.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ')}
                  </td>
                  <td className="px-4 py-3">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3 text-sol-blanco/60">
                    {new Date(order.createdAt).toLocaleDateString('es-AR')}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.estado}
                      onChange={(e) => handleChangeEstado(order, e.target.value)}
                      className={`rounded-full px-3 py-1.5 text-xs font-display font-bold border-none focus:outline-none ${ESTADO_STYLE[order.estado]}`}
                    >
                      {ESTADOS.filter((e) => e.value).map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {order.telefonoContacto ? (
                      <a
                        href={buildWhatsAppLink(
                          order.telefonoContacto,
                          `Hola ${order.cliente?.nombre || ''}! Te escribo de Óptica Sol por tu pedido #${order._id.slice(-6).toUpperCase()} para coordinar el envío.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 text-[#25D366] text-xs font-display font-bold px-3 py-1.5 hover:bg-[#25D366]/25 transition-colors whitespace-nowrap"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.81.48 3.53 1.32 5.02L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.14c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11a15.9 15.9 0 0 1-1.63-.6c-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.53.33.07.12.07.71-.17 1.39Z" />
                        </svg>
                        WhatsApp
                      </a>
                    ) : (
                      <span className="text-xs text-sol-blanco/30">Sin teléfono</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(order)}
                        className="rounded-full bg-sol-blanco/10 text-sol-blanco text-xs font-display font-bold px-3 py-1.5 hover:bg-sol-blanco/20 transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(order)}
                        className="rounded-full bg-sol-rojo/15 text-sol-rojo text-xs font-display font-bold px-3 py-1.5 hover:bg-sol-rojo/25 transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
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
