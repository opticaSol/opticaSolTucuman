// Crea el usuario super admin (dueño) si no existe todavía. No lo duplica ni
// lo pisa si ya está creado.
// Uso: npm run seed:superadmin  (con SUPERADMIN_EMAIL y SUPERADMIN_PASSWORD en .env)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

async function main() {
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;

  if (!email || !password) {
    console.error('Faltan SUPERADMIN_EMAIL y/o SUPERADMIN_PASSWORD en las variables de entorno');
    process.exit(1);
  }

  await connectDB();

  const existente = await User.findOne({ email: email.toLowerCase() });
  if (existente) {
    console.log(`Ya existe un usuario con ese email (${existente.email}), no se modifica.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    nombre: 'Dueño',
    email: email.toLowerCase(),
    passwordHash,
    rol: 'superadmin',
  });

  console.log(`Super admin creado: ${user.email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creando el super admin:', err);
  process.exit(1);
});
