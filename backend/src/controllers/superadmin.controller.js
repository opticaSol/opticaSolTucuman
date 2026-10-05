const { validationResult } = require('express-validator');
const Client = require('../models/Client');
const PromoMessage = require('../models/PromoMessage');
const { normalizeArgentinePhone } = require('../utils/normalizePhone');

const TEXTO_PROMO_DEFAULT =
  'Hola {nombre}! Te escribimos de Óptica Sol. Esta semana tenemos promociones en cristales, repuestos para anteojos de sol y reparaciones. ¡Te esperamos! Si no querés recibir más mensajes, avisanos.';

// Escapa caracteres especiales de regex antes de meter texto de un query
// param en un $regex de Mongo (si no, alguien podría mandar un patrón que
// cuelgue el servidor, o uno que no haga lo que el campo de búsqueda espera).
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
}

async function listClients(req, res, next) {
  try {
    const { q, aceptaPromos, sort, all, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (q) {
      const qSafe = escapeRegex(String(q)).slice(0, 100);
      filter.$or = [
        { nombre: { $regex: qSafe, $options: 'i' } },
        { whatsapp: { $regex: qSafe, $options: 'i' } },
      ];
    }
    if (aceptaPromos === 'true') filter.aceptaPromos = true;
    if (aceptaPromos === 'false') filter.aceptaPromos = false;

    if (all === 'true') {
      const items = await Client.find({ ...filter, aceptaPromos: true }).sort({ nombre: 1 });
      return res.json({ items, total: items.length });
    }

    const sortMap = { nombre: { nombre: 1 }, '-ultimoContacto': { ultimoContacto: -1 } };
    const sortBy = sortMap[sort] || sortMap.nombre;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));

    const [items, total] = await Promise.all([
      Client.find(filter)
        .sort(sortBy)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Client.countDocuments(filter),
    ]);

    res.json({ items, total, page: pageNum, totalPages: Math.ceil(total / limitNum) || 1 });
  } catch (err) {
    next(err);
  }
}

async function createClient(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const { nombre } = req.body;
    const whatsapp = normalizeArgentinePhone(req.body.whatsapp);

    if (!/^549\d{9,11}$/.test(whatsapp)) {
      return res.status(400).json({ message: 'Ingresá un WhatsApp válido' });
    }

    const existente = await Client.findOne({ whatsapp });
    if (existente) {
      return res.status(409).json({ message: `Ya está cargado: ${existente.nombre}` });
    }

    const client = await Client.create({ nombre, whatsapp });
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
}

async function updateClient(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    if (req.body.nombre !== undefined) client.nombre = req.body.nombre;

    if (req.body.whatsapp !== undefined) {
      const whatsapp = normalizeArgentinePhone(req.body.whatsapp);
      if (!/^549\d{9,11}$/.test(whatsapp)) {
        return res.status(400).json({ message: 'Ingresá un WhatsApp válido' });
      }
      const existente = await Client.findOne({ whatsapp, _id: { $ne: client._id } });
      if (existente) {
        return res.status(409).json({ message: `Ya está cargado: ${existente.nombre}` });
      }
      client.whatsapp = whatsapp;
    }

    if (req.body.aceptaPromos !== undefined) client.aceptaPromos = req.body.aceptaPromos;
    if (req.body.ultimoContacto !== undefined) client.ultimoContacto = req.body.ultimoContacto;

    await client.save();
    res.json(client);
  } catch (err) {
    next(err);
  }
}

async function deleteClient(req, res, next) {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    await client.deleteOne();
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    next(err);
  }
}

async function getPromoMessage(req, res, next) {
  try {
    let promo = await PromoMessage.findOne({});
    if (!promo) {
      promo = await PromoMessage.create({ texto: TEXTO_PROMO_DEFAULT });
    }
    res.json(promo);
  } catch (err) {
    next(err);
  }
}

async function updatePromoMessage(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const promo = await PromoMessage.findOneAndUpdate(
      {},
      { texto: req.body.texto },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(promo);
  } catch (err) {
    next(err);
  }
}

async function getSuperAdminDashboard(req, res, next) {
  try {
    const inicioMes = new Date();
    inicioMes.setDate(1);
    inicioMes.setHours(0, 0, 0, 0);

    const [totalClientes, clientesAceptanPromos, contactadosEsteMes] = await Promise.all([
      Client.countDocuments({}),
      Client.countDocuments({ aceptaPromos: true }),
      Client.countDocuments({ ultimoContacto: { $gte: inicioMes } }),
    ]);

    res.json({ totalClientes, clientesAceptanPromos, contactadosEsteMes });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listClients,
  createClient,
  updateClient,
  deleteClient,
  getPromoMessage,
  updatePromoMessage,
  getSuperAdminDashboard,
};
