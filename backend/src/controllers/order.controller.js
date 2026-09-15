const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { reservarStock, liberarStock } = require('../utils/stockService');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
}
const {
  mpDisponible,
  crearPreferencia,
  obtenerPago,
  buscarPagoPorPedido,
} = require('../utils/mercadopago');

const ESTADOS_VALIDOS = ['pagado', 'en_preparacion', 'listo', 'entregado', 'cancelado'];

// Compartido entre el webhook y la sincronización activa (getOrder): aplica el estado
// de un pago de Mercado Pago al pedido correspondiente.
async function aplicarEstadoPago(order, payment) {
  order.mercadopago.paymentId = String(payment.id);

  if (payment.status === 'approved') {
    order.estado = 'pagado';
  } else if (['rejected', 'cancelled'].includes(payment.status)) {
    order.estado = 'cancelado';
    await liberarStock(order.items);
  }

  await order.save();
}

async function createOrder(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    if (req.user.rol === 'admin') {
      return res.status(403).json({ message: 'Las cuentas admin no pueden realizar compras' });
    }

    const { items, telefono } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'El carrito está vacío' });
    }

    if (!telefono || String(telefono).trim().length < 6) {
      return res.status(400).json({ message: 'Ingresá un teléfono de contacto válido' });
    }

    // Recalcular precios y validar existencia contra la base de datos — nunca confiar en el front.
    const productIds = items.map((i) => i.productoId);
    const products = await Product.find({ _id: { $in: productIds }, activo: true });
    const productMap = new Map(products.map((p) => [String(p._id), p]));

    const orderItems = [];
    for (const item of items) {
      const product = productMap.get(String(item.productoId));
      if (!product) {
        return res.status(400).json({ message: 'Uno de los productos ya no está disponible' });
      }
      const cantidad = Math.max(1, Number(item.cantidad) || 1);
      const precio =
        product.precioDescuento && product.precioDescuento < product.precio
          ? product.precioDescuento
          : product.precio;

      if (!precio || precio <= 0) {
        return res.status(400).json({
          message: `"${product.nombre}" todavía no tiene un precio cargado. Sacalo del carrito o consultanos por WhatsApp para coordinar la compra.`,
        });
      }

      orderItems.push({
        producto: product._id,
        nombre: product.nombre,
        precio,
        cantidad,
      });
    }

    const total = orderItems.reduce((sum, i) => sum + i.precio * i.cantidad, 0);

    await reservarStock(orderItems);

    const order = await Order.create({
      cliente: req.user._id,
      items: orderItems,
      total,
      direccionEntrega: req.user.direccion,
      telefonoContacto: String(telefono).trim(),
      mercadopago: { simulado: !mpDisponible },
    });

    if (mpDisponible) {
      const preference = await crearPreferencia(order);
      order.mercadopago.preferenceId = preference.id;
      await order.save();
      return res.status(201).json({ orderId: order._id, checkoutUrl: preference.init_point });
    }

    return res.status(201).json({
      orderId: order._id,
      checkoutUrl: `/checkout/resultado?orderId=${order._id}&simulado=true`,
    });
  } catch (err) {
    next(err);
  }
}

async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    if (String(order.cliente) !== String(req.user._id) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tenés acceso a este pedido' });
    }

    // Fallback al webhook: si el pedido sigue pendiente, consulta directamente a Mercado
    // Pago (útil en desarrollo, donde notification_url apunta a localhost y MP no puede
    // llamarlo). En producción esto también actúa como red de seguridad si el webhook
    // se perdiera por algún motivo.
    if (order.estado === 'pendiente_pago' && mpDisponible && !order.mercadopago.simulado) {
      try {
        const payment = await buscarPagoPorPedido(order._id);
        if (payment) {
          await aplicarEstadoPago(order, payment);
        }
      } catch (err) {
        console.error('[mp-sync] Error consultando el pago en Mercado Pago:', err.message);
      }
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function deleteMyOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    if (String(order.cliente) !== String(req.user._id) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tenés acceso a este pedido' });
    }
    if (!['pendiente_pago', 'cancelado'].includes(order.estado)) {
      return res
        .status(400)
        .json({ message: 'Solo podés eliminar pedidos pendientes o cancelados' });
    }

    // Si seguía pendiente, el stock estaba reservado y hay que liberarlo. Si ya estaba
    // cancelado, el stock ya se liberó en ese momento — no hay que tocarlo de nuevo.
    if (order.estado === 'pendiente_pago') {
      await liberarStock(order.items);
    }
    await order.deleteOne();

    res.json({ message: 'Pedido eliminado' });
  } catch (err) {
    next(err);
  }
}

async function simulatePayment(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    if (String(order.cliente) !== String(req.user._id) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tenés acceso a este pedido' });
    }
    if (!order.mercadopago.simulado) {
      return res.status(400).json({ message: 'Este pedido no está en modo simulado' });
    }
    if (order.estado !== 'pendiente_pago') {
      return res.status(400).json({ message: 'Este pedido ya fue procesado' });
    }

    const { aprobado } = req.body;

    if (aprobado) {
      order.estado = 'pagado';
    } else {
      order.estado = 'cancelado';
      await liberarStock(order.items);
    }

    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function webhook(req, res, next) {
  try {
    const paymentId = req.query['data.id'] || req.query.id || req.body?.data?.id;
    const topic = req.query.type || req.query.topic;

    if (!paymentId || topic !== 'payment') {
      return res.sendStatus(200);
    }

    const payment = await obtenerPago(paymentId);
    const order = await Order.findById(payment.external_reference);

    if (!order || order.estado !== 'pendiente_pago') {
      return res.sendStatus(200);
    }

    await aplicarEstadoPago(order, payment);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function listMyOrders(req, res, next) {
  try {
    const { page = 1, limit = 5 } = req.query;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const filter = { cliente: req.user._id };

    const [items, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

async function adminListOrders(req, res, next) {
  try {
    const { estado, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (estado) filter.estado = estado;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Order.find(filter)
        .populate('cliente', 'nombre email')
        .sort({ createdAt: -1, _id: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    res.json({
      items,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

async function adminUpdateOrder(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const { telefonoContacto, direccionEntrega } = req.body;

    if (telefonoContacto !== undefined && String(telefonoContacto).trim().length < 6) {
      return res.status(400).json({ message: 'Ingresá un teléfono de contacto válido' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (telefonoContacto !== undefined) order.telefonoContacto = String(telefonoContacto).trim();
    if (direccionEntrega !== undefined) order.direccionEntrega = direccionEntrega;

    await order.save();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

async function adminDeleteOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (order.estado === 'pendiente_pago') {
      await liberarStock(order.items);
    }
    await order.deleteOne();

    res.json({ message: 'Pedido eliminado' });
  } catch (err) {
    next(err);
  }
}

async function adminUpdateOrderStatus(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const { estado } = req.body;

    if (!ESTADOS_VALIDOS.includes(estado)) {
      return res.status(400).json({ message: 'Estado inválido' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    if (estado === 'cancelado' && order.estado !== 'cancelado') {
      await liberarStock(order.items);
    }

    order.estado = estado;
    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createOrder,
  getOrder,
  deleteMyOrder,
  simulatePayment,
  webhook,
  listMyOrders,
  adminListOrders,
  adminUpdateOrder,
  adminDeleteOrder,
  adminUpdateOrderStatus,
  aplicarEstadoPago,
};
