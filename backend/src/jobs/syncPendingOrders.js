const Order = require('../models/Order');
const { mpDisponible, buscarPagoPorPedido } = require('../utils/mercadopago');
const { aplicarEstadoPago } = require('../controllers/order.controller');

const INTERVALO_MS = 60 * 1000;

// Red de seguridad además del webhook: revisa periódicamente los pedidos con pago real
// de Mercado Pago que sigan "pendiente_pago" y consulta su estado directamente, sin
// depender de que el cliente vuelva a visitar la página de resultado del checkout ni de
// que el webhook pueda alcanzar el servidor (por ejemplo, en desarrollo con localhost).
async function sincronizarPedidosPendientes() {
  const pendientes = await Order.find({
    estado: 'pendiente_pago',
    'mercadopago.simulado': false,
  });

  for (const order of pendientes) {
    try {
      const payment = await buscarPagoPorPedido(order._id);
      if (payment) {
        await aplicarEstadoPago(order, payment);
      }
    } catch (err) {
      console.error(`[sync-job] Error sincronizando pedido ${order._id}:`, err.message);
    }
  }
}

function iniciarSincronizacionPeriodica() {
  if (!mpDisponible) {
    console.log('[sync-job] Mercado Pago no configurado — sincronización periódica desactivada.');
    return;
  }

  console.log('[sync-job] Sincronización periódica de pagos activada (cada 60s).');
  setInterval(() => {
    sincronizarPedidosPendientes().catch((err) =>
      console.error('[sync-job] Error en la sincronización periódica:', err.message)
    );
  }, INTERVALO_MS);
}

module.exports = { iniciarSincronizacionPeriodica, sincronizarPedidosPendientes };
