function notFound(req, res, next) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.originalUrl}` });
}

// Traduce errores técnicos de Mongo/Mongoose a un mensaje que un usuario no
// técnico pueda entender. Los errores que nosotros mismos armamos a mano (con
// err.status y un mensaje en español, ej. "Ingresá un teléfono válido") pasan
// tal cual: ya están pensados para mostrarse.
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === 'ValidationError' && err.errors) {
    const primerCampo = Object.keys(err.errors)[0];
    return res.status(400).json({
      message: `Revisá el campo "${primerCampo}": el valor cargado no es válido.`,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Uno de los datos ingresados no tiene el formato correcto.' });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: 'Ya existe un registro con ese mismo dato.' });
  }

  const status = err.status || 500;
  const message = status === 500 ? 'Ocurrió un error inesperado. Intentá de nuevo en unos minutos.' : err.message;

  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };
