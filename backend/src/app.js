const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const productRoutes = require('./routes/product.routes');
const promotionRoutes = require('./routes/promotion.routes');
const heroSlideRoutes = require('./routes/heroSlide.routes');
const leadRoutes = require('./routes/lead.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const superadminRoutes = require('./routes/superadmin.routes');
const recetaRoutes = require('./routes/receta.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Headers de seguridad básicos (saca "X-Powered-By: Express", agrega
// X-Content-Type-Options, etc.). Sin CSP porque esto es una API JSON, no
// sirve HTML; y con CORP en "cross-origin" porque el frontend la consume
// desde otro dominio (a través del rewrite de Vercel).
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Lista de orígenes permitidos en vez de depender de una sola variable de
// entorno: evita que el CORS quede roto cuando se agrega/cambia un dominio
// (ej. al conectar el dominio propio en Vercel) y alguien se olvida de
// actualizar FRONTEND_URL.
const ALLOWED_ORIGINS = [
  process.env.FRONTEND_URL,
  'https://opticasoltucuman.com',
  'https://www.opticasoltucuman.com',
  'https://optica-sol-tucuman.vercel.app',
  'https://optica-sol-tucuman-3pf7.vercel.app',
  'http://localhost:5173',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Sin "origin" (ej. curl, health checks) se deja pasar.
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('No autorizado por CORS'));
    },
  })
);
app.use(express.json());
// Saca claves que empiecen con "$" o tengan "." de body/query/params, para
// que nadie pueda inyectar operadores de Mongo (ej. ?categoria[$ne]=null)
// en los filtros que arman los controllers a partir de req.query.
app.use(mongoSanitize());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superadminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/recetas', recetaRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
