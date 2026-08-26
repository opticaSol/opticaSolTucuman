import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { fetchOrder, simulateOrderPayment } from '../lib/api';
import { formatPrice } from '../lib/formatters';
import PageTransition from '../components/ui/PageTransition';

const ESTADO_INFO = {
  pendiente_pago: { label: 'Pago pendiente', color: 'text-sol-blanco' },
  pagado: { label: '¡Pago aprobado!', color: 'text-sol-amarillo' },
  en_preparacion: { label: 'En preparación', color: 'text-sol-amarillo' },
  listo: { label: 'Listo para retirar', color: 'text-sol-amarillo' },
  entregado: { label: 'Entregado', color: 'text-sol-amarillo' },
  cancelado: { label: 'Pago rechazado / cancelado', color: 'text-sol-rojo' },
};

export default function CheckoutResultado() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulating, setSimulating] = useState(false);

  function load(silent = false) {
    if (!silent) setLoading(true);
    return fetchOrder(orderId)
      .then(setOrder)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (orderId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Mientras el pago real de Mercado Pago sigue pendiente, reconsulta cada pocos segundos
  // (getOrder ya sincroniza activamente con MP) para reflejar "pagado" sin que el usuario
  // tenga que recargar manualmente al volver del checkout.
  useEffect(() => {
    if (!order || order.estado !== 'pendiente_pago' || order.mercadopago?.simulado) return;

    let tries = 0;
    const interval = setInterval(() => {
      tries += 1;
      if (tries > 20) {
        clearInterval(interval);
        return;
      }
      load(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [order?.estado, order?.mercadopago?.simulado]);

  async function handleSimulate(aprobado) {
    setSimulating(true);
    try {
      const updated = await simulateOrderPayment(orderId, aprobado);
      setOrder(updated);
      Swal.fire({
        icon: aprobado ? 'success' : 'error',
        title: aprobado ? 'Pago simulado aprobado' : 'Pago simulado rechazado',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: aprobado ? '#F5C518' : '#D32027',
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo simular el pago',
        text: err.response?.data?.message,
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    } finally {
      setSimulating(false);
    }
  }

  if (!orderId) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-sol-blanco/60">
        No encontramos ningún pedido para mostrar.
      </div>
    );
  }

  if (loading || !order) {
    return <div className="max-w-md mx-auto px-6 py-20 text-center text-sol-blanco/60">Cargando pedido...</div>;
  }

  const estado = ESTADO_INFO[order.estado] || ESTADO_INFO.pendiente_pago;

  return (
    <PageTransition className="max-w-lg mx-auto px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <h1 className={`font-display font-black text-2xl uppercase mb-2 ${estado.color}`}>
          {estado.label}
        </h1>
      </motion.div>
      <p className="text-sol-blanco/60 mb-2">Pedido #{order._id.slice(-6).toUpperCase()}</p>

      {order.estado === 'pendiente_pago' && !order.mercadopago?.simulado && (
        <div className="flex items-center justify-center gap-2 mb-6 text-xs text-sol-blanco/50">
          <motion.span
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-1.5 h-1.5 rounded-full bg-sol-amarillo"
          />
          Verificando el pago con Mercado Pago...
          <button onClick={() => load()} className="underline hover:text-sol-amarillo">
            Verificar ahora
          </button>
        </div>
      )}

      <div className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5 text-left mb-8">
        {order.items.map((item) => (
          <div key={item.producto} className="flex justify-between text-sm py-1.5">
            <span>
              {item.cantidad}x {item.nombre}
            </span>
            <span>{formatPrice(item.precio * item.cantidad)}</span>
          </div>
        ))}
        <div className="flex justify-between font-display font-bold pt-3 mt-2 border-t border-sol-blanco/10">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>

      <AnimatePresence>
        {order.mercadopago?.simulado && order.estado === 'pendiente_pago' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl2 border border-dashed border-sol-amarillo/50 p-5 mb-8 overflow-hidden"
          >
            <p className="text-xs text-sol-amarillo/80 mb-3 uppercase font-display font-bold">
              Modo simulado (sin Mercado Pago real configurado)
            </p>
            <div className="flex gap-3 justify-center">
              <motion.button
                onClick={() => handleSimulate(true)}
                disabled={simulating}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-5 py-2.5 text-sm disabled:opacity-50"
              >
                Simular pago aprobado
              </motion.button>
              <motion.button
                onClick={() => handleSimulate(false)}
                disabled={simulating}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-full bg-sol-rojo text-sol-blanco font-display font-bold px-5 py-2.5 text-sm disabled:opacity-50"
              >
                Simular pago rechazado
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Link
        to="/catalogo"
        className="inline-block text-sm font-display font-bold text-sol-amarillo underline underline-offset-4"
      >
        Seguir comprando
      </Link>
    </PageTransition>
  );
}
