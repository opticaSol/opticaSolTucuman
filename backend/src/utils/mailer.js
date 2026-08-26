const nodemailer = require('nodemailer');

function getTransporter() {
  const { SMTP_USER, SMTP_APP_PASSWORD } = process.env;
  if (!SMTP_USER || !SMTP_APP_PASSWORD) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
  });
}

async function enviarAlertaStockBajo(producto) {
  const { SMTP_USER, ADMIN_ALERT_EMAIL } = process.env;
  const transporter = getTransporter();

  if (!transporter || !ADMIN_ALERT_EMAIL) {
    console.log(
      `[stock-alert] (no enviado, falta config SMTP) "${producto.nombre}" quedó con stock ${producto.stock} (umbral ${producto.umbralStockBajo})`
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: `Óptica Sol <${SMTP_USER}>`,
      to: ADMIN_ALERT_EMAIL,
      subject: `Stock bajo: ${producto.nombre}`,
      text: `El producto "${producto.nombre}" (${producto.marca}) quedó con stock ${producto.stock}, por debajo o igual al umbral de ${producto.umbralStockBajo} unidades.`,
      html: `<p>El producto <strong>${producto.nombre}</strong> (${producto.marca}) quedó con stock <strong>${producto.stock}</strong>, por debajo o igual al umbral de ${producto.umbralStockBajo} unidades.</p>`,
    });
  } catch (err) {
    console.error('[stock-alert] Error enviando email:', err.message);
  }
}

const ESTADO_LABEL = {
  pendiente_pago: 'Pago pendiente',
  pagado: 'Pago acreditado',
  en_preparacion: 'En preparación',
  listo: 'Listo para retirar',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

async function enviarNotificacionPedido(order, user) {
  const { SMTP_USER } = process.env;
  const transporter = getTransporter();
  const estadoLabel = ESTADO_LABEL[order.estado] || order.estado;

  if (!transporter || !user?.email) {
    console.log(
      `[order-notify] (no enviado, falta config SMTP) Pedido ${order._id} de ${user?.email || 'cliente desconocido'} → ${estadoLabel}`
    );
    return;
  }

  try {
    await transporter.sendMail({
      from: `Óptica Sol <${SMTP_USER}>`,
      to: user.email,
      subject: `Tu pedido #${String(order._id).slice(-6).toUpperCase()} — ${estadoLabel}`,
      text: `Hola ${user.nombre || ''}, tu pedido cambió de estado: ${estadoLabel}.`,
      html: `<p>Hola ${user.nombre || ''},</p><p>Tu pedido <strong>#${String(order._id).slice(-6).toUpperCase()}</strong> cambió de estado a: <strong>${estadoLabel}</strong>.</p>`,
    });
  } catch (err) {
    console.error('[order-notify] Error enviando email:', err.message);
  }
}

async function enviarNotificacionNuevoPedido(order, user) {
  const { SMTP_USER, ADMIN_ALERT_EMAIL } = process.env;
  const transporter = getTransporter();
  const numero = String(order._id).slice(-6).toUpperCase();

  if (!transporter || !ADMIN_ALERT_EMAIL) {
    console.log(
      `[new-order] (no enviado, falta config SMTP) Pedido #${numero} de ${user?.email || 'cliente desconocido'} (tel: ${order.telefonoContacto || 'sin teléfono'}) por un total de ${order.total}`
    );
    return;
  }

  const itemsTexto = order.items.map((i) => `${i.cantidad}x ${i.nombre}`).join(', ');
  const telefono = order.telefonoContacto || 'sin teléfono';

  try {
    await transporter.sendMail({
      from: `Óptica Sol <${SMTP_USER}>`,
      to: ADMIN_ALERT_EMAIL,
      subject: `Nuevo pedido #${numero} — $${order.total}`,
      text: `Nuevo pedido de ${user?.nombre || 'cliente'} (${user?.email || 'sin email'}, tel: ${telefono}).\nItems: ${itemsTexto}\nTotal: $${order.total}`,
      html: `<p>Nuevo pedido de <strong>${user?.nombre || 'cliente'}</strong> (${user?.email || 'sin email'}).</p><p>Teléfono: <strong>${telefono}</strong></p><p>${itemsTexto}</p><p>Total: <strong>$${order.total}</strong></p>`,
    });
  } catch (err) {
    console.error('[new-order] Error enviando email:', err.message);
  }
}

module.exports = { enviarAlertaStockBajo, enviarNotificacionPedido, enviarNotificacionNuevoPedido };
