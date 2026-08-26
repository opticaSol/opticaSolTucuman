require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const { iniciarSincronizacionPeriodica } = require('./jobs/syncPendingOrders');

const PORT = process.env.PORT || 4000;

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Servidor Óptica Sol escuchando en http://localhost:${PORT}`);
  });
  iniciarSincronizacionPeriodica();
}

start().catch((err) => {
  console.error('Error al iniciar el servidor:', err.message);
  process.exit(1);
});
