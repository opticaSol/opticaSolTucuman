const { validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

function handleValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
    return false;
  }
  return true;
}

async function login(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    res.json({ user, token: generateToken(user) });
  } catch (err) {
    next(err);
  }
}

async function getMe(req, res) {
  res.json({ user: req.user });
}

async function updateMe(req, res, next) {
  try {
    if (!handleValidation(req, res)) return;

    const { nombre, telefono, direccion } = req.body;

    if (nombre !== undefined) req.user.nombre = nombre;
    if (telefono !== undefined) req.user.telefono = telefono;
    if (direccion !== undefined) req.user.direccion = direccion;

    await req.user.save();
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, getMe, updateMe };
