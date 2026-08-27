require('dotenv').config();

const app = require('../src/app');
const connectDB = require('../src/config/db');

// En serverless no hay app.listen(): Vercel invoca esta función en cada
// request. La conexión a Mongo se cachea entre invocaciones "warm" del
// mismo proceso para no reconectar en cada llamada.
let connectionPromise = null;

module.exports = async (req, res) => {
  if (!connectionPromise) {
    connectionPromise = connectDB().catch((err) => {
      connectionPromise = null;
      throw err;
    });
  }

  try {
    await connectionPromise;
  } catch (err) {
    res.status(500).json({ message: 'Error de conexión a la base de datos' });
    return;
  }

  return app(req, res);
};
