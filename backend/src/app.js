const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/product.routes');
const promotionRoutes = require('./routes/promotion.routes');
const leadRoutes = require('./routes/lead.routes');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const orderRoutes = require('./routes/order.routes');
const recetaRoutes = require('./routes/receta.routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/recetas', recetaRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
