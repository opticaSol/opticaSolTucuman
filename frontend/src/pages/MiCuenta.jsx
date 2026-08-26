import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { profileSchema } from '../schemas/authSchemas';
import { updateMe, fetchMyOrders, deleteOrder } from '../lib/api';
import { useUserStore } from '../store/useUserStore';
import { useCartStore } from '../store/useCartStore';
import { formatPrice } from '../lib/formatters';
import { confirmLogout } from '../lib/confirmLogout';
import { STORE_WHATSAPP_URL } from '../lib/whatsapp';
import PageTransition from '../components/ui/PageTransition';
import Pagination from '../components/ui/Pagination';

const LIMIT = 5;

const ESTADO_INFO = {
  pendiente_pago: { label: 'Pago pendiente', className: 'bg-sol-blanco/10 text-sol-blanco/70' },
  pagado: { label: 'Pagado', className: 'bg-sol-amarillo/20 text-sol-amarillo' },
  en_preparacion: { label: 'En preparación', className: 'bg-sol-amarillo/20 text-sol-amarillo' },
  listo: { label: 'Listo para retirar', className: 'bg-sol-amarillo/20 text-sol-amarillo' },
  entregado: { label: 'Entregado', className: 'bg-sol-amarillo/20 text-sol-amarillo' },
  cancelado: { label: 'Cancelado', className: 'bg-sol-rojo/20 text-sol-rojo' },
};

function MisPedidos() {
  const [orders, setOrders] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  function load() {
    fetchMyOrders({ page, limit: LIMIT }).then((data) => {
      setOrders(data.items);
      setTotalPages(data.totalPages);
    });
  }

  useEffect(() => {
    setOrders(null);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function handleDelete(order) {
    const result = await Swal.fire({
      title: '¿Eliminar pedido?',
      text: `Pedido #${order._id.slice(-6).toUpperCase()}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#D32027',
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
    if (!result.isConfirmed) return;

    try {
      await deleteOrder(order._id);
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
      if (orders.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        load();
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo eliminar',
        text: err.response?.data?.message || 'Intentá de nuevo',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  function volverAComprar(order) {
    order.items.forEach((item) => {
      addItem(
        {
          _id: item.producto,
          nombre: item.nombre,
          imagenes: [],
          precio: item.precio,
          precioDescuento: null,
          stock: 99,
        },
        item.cantidad
      );
    });
    navigate('/carrito');
  }

  if (!orders) {
    return <p className="text-sm text-sol-blanco/60">Cargando pedidos...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-sm text-sol-blanco/60">Todavía no hiciste ningún pedido.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {orders.map((order, i) => {
        const estado = ESTADO_INFO[order.estado] || ESTADO_INFO.pendiente_pago;
        return (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            whileHover={{ y: -2 }}
            className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-sm">
                Pedido #{order._id.slice(-6).toUpperCase()}
              </span>
              <span className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${estado.className}`}>
                {estado.label}
              </span>
            </div>
            <p className="text-xs text-sol-blanco/50 mb-2">
              {new Date(order.createdAt).toLocaleDateString('es-AR')}
            </p>
            <div className="text-sm text-sol-blanco/80 flex flex-col gap-0.5 mb-3">
              {order.items.map((item, idx) => (
                <span key={idx}>
                  {item.cantidad}x {item.nombre}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-display font-bold">{formatPrice(order.total)}</span>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => volverAComprar(order)}
                className="text-xs font-display font-bold text-sol-amarillo hover:underline"
              >
                Volver a comprar
              </motion.button>
            </div>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <a
                href={STORE_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#25D366]/15 text-[#25D366] text-xs font-display font-bold px-3 py-1.5 hover:bg-[#25D366]/25 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.81.48 3.53 1.32 5.02L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.78 14.14c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.11a15.9 15.9 0 0 1-1.63-.6c-2.87-1.24-4.74-4.13-4.88-4.32-.14-.19-1.17-1.55-1.17-2.96 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.57.81 1.98.88 2.12.07.14.12.31.02.5-.1.19-.15.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.13.57.17.28.75 1.24 1.61 2.01 1.11.99 2.04 1.29 2.32 1.44.28.14.44.12.6-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.09 1.66.78 1.94.93.28.14.47.21.53.33.07.12.07.71-.17 1.39Z" />
                </svg>
                Consultar por este pedido
              </a>

              {(order.estado === 'pendiente_pago' || order.estado === 'cancelado') && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(order)}
                  className="text-xs font-display font-bold text-sol-rojo hover:underline"
                >
                  Eliminar
                </motion.button>
              )}
            </div>
          </motion.div>
        );
      })}

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
}

export default function MiCuenta() {
  const navigate = useNavigate();
  const user = useUserStore((s) => s.user);
  const setUser = useUserStore((s) => s.setUser);
  const logout = useUserStore((s) => s.logout);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombre: user?.nombre || '',
      telefono: user?.telefono || '',
      direccion: user?.direccion || '',
    },
  });

  async function onSubmit(values) {
    try {
      const data = await updateMe(values);
      setUser(data.user);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Perfil actualizado',
        showConfirmButton: false,
        timer: 1800,
        background: '#0D0D0D',
        color: '#FFFFFF',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos guardar los cambios',
        text: err.response?.data?.message || 'Intentá de nuevo',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  async function handleLogout() {
    if (await confirmLogout()) {
      logout();
      navigate('/');
    }
  }

  const inicial = user?.nombre?.[0]?.toUpperCase() || '?';

  return (
    <PageTransition className="max-w-lg mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-sol-amarillo text-sol-negro flex items-center justify-center font-display font-black text-2xl shrink-0">
          {inicial}
        </div>
        <div>
          <h1 className="font-display font-black text-2xl uppercase">{user?.nombre}</h1>
          <p className="text-sm text-sol-blanco/60">{user?.email}</p>
        </div>
      </div>

      <div className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-6 mb-10">
        <h2 className="font-display font-extrabold uppercase text-sm text-sol-amarillo mb-5">
          Mis datos
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-sol-blanco/50">Nombre</label>
            <input
              type="text"
              {...register('nombre')}
              className="w-full mt-1 rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
            />
            {errors.nombre && <p className="text-xs text-sol-rojo mt-1 px-2">{errors.nombre.message}</p>}
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-sol-blanco/50">Teléfono</label>
            <input
              type="tel"
              placeholder="Ej: 381 1234567"
              {...register('telefono')}
              className="w-full mt-1 rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wide text-sol-blanco/50">
              Dirección de retiro/envío
            </label>
            <input
              type="text"
              {...register('direccion')}
              className="w-full mt-1 rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
            />
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting || !isDirty}
            whileHover={{ scale: isDirty ? 1.02 : 1 }}
            whileTap={{ scale: isDirty ? 0.97 : 1 }}
            className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-40"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </motion.button>
        </form>
      </div>

      <div>
        <h2 className="font-display font-extrabold uppercase text-sm text-sol-amarillo mb-3">
          Mis pedidos
        </h2>
        <MisPedidos />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="mt-10 w-full text-center text-sm text-sol-rojo font-display font-bold hover:underline"
      >
        Cerrar sesión
      </motion.button>
    </PageTransition>
  );
}
