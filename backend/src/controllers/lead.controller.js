const Lead = require('../models/Lead');

async function createLead(req, res, next) {
  try {
    const { nombre = '', contacto, origen } = req.body;

    if (!contacto || !contacto.trim()) {
      return res.status(400).json({ message: 'El contacto (email o teléfono) es obligatorio' });
    }

    const lead = await Lead.create({ nombre, contacto: contacto.trim(), origen });
    res.status(201).json({ message: 'Gracias, te vamos a contactar pronto', lead });
  } catch (err) {
    next(err);
  }
}

module.exports = { createLead };
