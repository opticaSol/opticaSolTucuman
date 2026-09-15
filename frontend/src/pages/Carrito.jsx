import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import { useCartStore } from '../store/useCartStore';
import { useUserStore } from '../store/useUserStore';
import CartItem from '../components/carrito/CartItem';
import { formatPrice } from '../lib/formatters';
import { createOrder } from '../lib/api';
import PageTransition from '../components/ui/PageTransition';

export default function Carrito() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const clearCart = useCartStore((s) => s.clearCart);
  const isAuthenticated = useUserStore((s) => s.isAuthenticated());
  const user = useUserStore((s) => s.user);
  const isAdmin = user?.rol === 'admin';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [telefono, setTelefono] = useState(user?.telefono || '');
  const [telefonoError, setTelefonoError] = useState('');

  async function handleCheckout() {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/carrito' } });
      return;
    }

    if (isAdmin) {
      Swal.fire({
        icon: 'info',
        title: 'Las cuentas admin no pueden comprar',
        text: 'Iniciá sesión con una cuenta de cliente para realizar un pedido.',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
      });
      return;
    }

    if (!telefono.trim() || telefono.replace(/\D/g, '').length < 6) {
      setTelefonoError('Ingresá un teléfono válido para que podamos contactarte por el envío');
      return;
    }
    setTelefonoError('');

    setLoading(true);
    try {
      const { checkoutUrl } = await createOrder(
        items.map((i) => ({ productoId: i._id, cantidad: i.qty })),
        telefono.trim()
      );
      clearCart();
      window.location.href = checkoutUrl;
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos iniciar la compra',
        text: err.response?.data?.message || 'Intentá de nuevo en unos minutos',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <PageTransition className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display font-black text-2xl uppercase mb-3">Tu carrito está vacío</h1>
        <p className="text-sol-blanco/60 mb-6">Descubrí nuestras promos y armá tu pedido.</p>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
          <Link
            to="/#catalogo"
            className="inline-block rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-6 py-3"
          >
            Ir al catálogo
          </Link>
        </motion.div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-3xl mx-auto px-6 py-8 pb-28">
      <h1 className="font-display font-black text-2xl uppercase mb-6">Tu carrito</h1>

      <div>
        <AnimatePresence initial={false}>
          {items.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <CartItem item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5"
      >
        <div className="flex justify-between items-center text-lg font-display font-bold">
          <span>Subtotal</span>
          <span>{formatPrice(totalPrice)}</span>
        </div>
        <p className="text-xs text-sol-blanco/50 mt-1 mb-4">
          10% OFF adicional pagando en efectivo o transferencia. Consultá cuotas sin interés.
        </p>

        {isAdmin ? (
          <p className="text-sm text-sol-rojo bg-sol-rojo/10 border border-sol-rojo/30 rounded-lg px-4 py-3 mb-1">
            Estás usando una cuenta admin. Las cuentas admin no pueden realizar compras — iniciá
            sesión con una cuenta de cliente para comprar.
          </p>
        ) : (
          <>
            <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">
              Teléfono de contacto para coordinar el envío
            </label>
            <input
              type="tel"
              placeholder="Ej: 381 1234567"
              value={telefono}
              onChange={(e) => {
                setTelefono(e.target.value);
                if (telefonoError) setTelefonoError('');
              }}
              className="w-full rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
            />
            {telefonoError && <p className="text-xs text-sol-rojo mt-1 px-2">{telefonoError}</p>}
          </>
        )}

        <motion.button
          onClick={handleCheckout}
          disabled={loading || isAdmin}
          whileHover={{ scale: loading || isAdmin ? 1 : 1.02 }}
          whileTap={{ scale: loading || isAdmin ? 1 : 0.97 }}
          className="mt-4 w-full rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3.5 disabled:opacity-50 shadow-card"
        >
          {loading ? 'Procesando...' : isAdmin ? 'No disponible para admin' : 'Finalizar compra'}
        </motion.button>
      </motion.div>
    </PageTransition>
  );
}
