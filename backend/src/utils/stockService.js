const Product = require('../models/Product');
const { enviarAlertaStockBajo } = require('./mailer');

async function liberarStock(items) {
  for (const item of items) {
    await Product.updateOne({ _id: item.producto }, { $inc: { stock: item.cantidad } });
  }
}

async function reservarStock(items) {
  const reservados = [];

  for (const item of items) {
    // Se permite comprar aunque no haya stock (pedido especial al proveedor), así que
    // esto ya no bloquea la compra: solo descuenta, incluso si el stock queda en 0 o negativo.
    const before = await Product.findOneAndUpdate(
      { _id: item.producto },
      { $inc: { stock: -item.cantidad } },
      { new: false }
    );

    if (!before) {
      await liberarStock(reservados);
      const err = new Error(`El producto "${item.nombre}" ya no existe`);
      err.status = 409;
      throw err;
    }

    reservados.push(item);

    const nuevoStock = before.stock - item.cantidad;
    const cruzoUmbral = before.stock > before.umbralStockBajo && nuevoStock <= before.umbralStockBajo;
    if (cruzoUmbral) {
      enviarAlertaStockBajo({ ...before.toObject(), stock: nuevoStock }).catch(() => {});
    }
  }

  return reservados;
}

module.exports = { reservarStock, liberarStock };
