const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta MONGODB_URI en las variables de entorno');
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB conectado');
  });
  mongoose.connection.on('error', (err) => {
    console.error('Error de conexión a MongoDB:', err.message);
  });

  await mongoose.connect(uri);
}

module.exports = connectDB;
