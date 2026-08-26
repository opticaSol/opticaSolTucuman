// Crea (o promueve a admin) un usuario puntual.
// Uso: node src/seed/createAdmin.js "Nombre Admin" admin@opticasol.com contraseñaSegura
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

async function main() {
  const [, , nombre, email, password] = process.argv;

  if (!nombre || !email || !password) {
    console.error('Uso: node src/seed/createAdmin.js "Nombre" email@ejemplo.com password');
    process.exit(1);
  }

  await connectDB();

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase() },
    { nombre, email: email.toLowerCase(), passwordHash, rol: 'admin' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Usuario admin listo: ${user.email}`);
  process.exit(0);
}

main().catch((err) => {
  console.error('Error creando admin:', err);
  process.exit(1);
});
