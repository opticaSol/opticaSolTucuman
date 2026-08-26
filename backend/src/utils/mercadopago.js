const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const mpDisponible = Boolean(accessToken);

const client = mpDisponible ? new MercadoPagoConfig({ accessToken }) : null;

async function crearPreferencia(order) {
  const preference = new Preference(client);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const backUrl = `${frontendUrl}/checkout/resultado?orderId=${order._id}`;

  // auto_return exige que back_urls.success sea una URL https pública — en desarrollo
  // (FRONTEND_URL=http://localhost:...) la API la rechaza, así que solo se manda en producción.
  const esUrlPublicaHttps = backUrl.startsWith('https://');

  const body = {
    items: order.items.map((item) => ({
      id: String(item.producto),
      title: item.nombre,
      quantity: item.cantidad,
      unit_price: item.precio,
      currency_id: 'ARS',
    })),
    back_urls: { success: backUrl, pending: backUrl, failure: backUrl },
    external_reference: String(order._id),
    notification_url: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/orders/webhook`,
  };

  if (esUrlPublicaHttps) {
    body.auto_return = 'approved';
  }

  const result = await preference.create({ body });

  return result;
}

async function obtenerPago(paymentId) {
  const payment = new Payment(client);
  return payment.get({ id: paymentId });
}

// Fallback para cuando el webhook no puede llegar (ej. notification_url apuntando a
// localhost en desarrollo): busca el pago directamente en la API de Mercado Pago por
// external_reference (el id del pedido).
async function buscarPagoPorPedido(orderId) {
  const payment = new Payment(client);
  const result = await payment.search({
    options: { external_reference: String(orderId), sort: 'date_created', criteria: 'desc' },
  });
  return result.results?.[0] || null;
}

module.exports = { mpDisponible, crearPreferencia, obtenerPago, buscarPagoPorPedido };
