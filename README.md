# Óptica Sol — E-commerce (Fase 1 + Fase 2a + Fase 2b + Fase 2c + Fase 2d)

Monorepo MERN para el sitio de Óptica Sol (San Miguel de Tucumán). Con esta fase se completa todo
lo pedido originalmente (storefront, auth, admin, checkout y gestión de pedidos).

- **Fase 1**: storefront público completo (Home motor de ventas, catálogo con filtros, ficha de
  producto, carrito persistido).
- **Fase 2a**: autenticación JWT (registro, login, perfil editable en `/mi-cuenta`, roles
  `cliente`/`admin`, rutas protegidas).
- **Fase 2b**: panel `/admin` (dashboard con métricas de stock, CRUD completo de productos con
  carga de imágenes a Cloudinary, CRUD completo de promociones).
- **Fase 2c**: checkout con Mercado Pago, modelo `Order`, reserva/descuento/liberación automática
  de stock, y alerta por email cuando un producto cruza su umbral de stock bajo.
- **Fase 2d**: gestión de pedidos en `/admin/pedidos` (listar, filtrar por estado, cambiar estado
  con notificación por email al cliente) e historial real de pedidos en `/mi-cuenta` (con "volver
  a comprar").

Queda pendiente únicamente cargar credenciales reales (Mercado Pago, Gmail SMTP) cuando el usuario
las tenga, y mejoras opcionales fuera del alcance original (guía de talles, comparador de
armazones, gestión de usuarios en el admin).

## Estructura

- `backend/` — API REST con Node + Express (CommonJS) + Mongoose (MongoDB Atlas).
- `frontend/` — React + Vite + Tailwind CSS + Framer Motion + Zustand + React Hook Form + Zod.

## Requisitos

- Node.js 18+
- Una base de datos MongoDB Atlas (ya configurada en `backend/.env`)
- Cuenta de Cloudinary (ya configurada en `backend/.env`)

## Cómo correr en local

### Todo junto (recomendado)

Desde la raíz del repo:

```bash
npm install          # instala concurrently en la raíz
npm run install:all  # instala las dependencias de backend/ y frontend/
npm run dev           # levanta backend (:4000) y frontend (:5173) juntos
```

Esto corre `backend` y `frontend` en paralelo (vía `concurrently`), cada uno con su prefijo de
color en la consola. `Ctrl+C` corta ambos a la vez.

Pasos que solo hacen falta una vez:

```bash
npm run seed --prefix backend                                              # productos y promos de ejemplo
node backend/src/seed/createAdmin.js "Nombre Admin" admin@opticasol.com "contraseñaSegura"
node frontend/scripts/generate-favicons.cjs                                # favicons desde el logo
```

### Backend y frontend por separado

Si preferís correrlos en terminales distintas (por ejemplo para ver los logs de cada uno aparte):

```bash
cd backend
npm install
npm run seed   # carga productos y promociones de ejemplo en MongoDB Atlas
npm run dev    # http://localhost:4000
```

```bash
cd frontend
npm install
node scripts/generate-favicons.cjs  # genera los favicons a partir del logo (una sola vez)
npm run dev    # http://localhost:5173 (con proxy a /api -> :4000)
```

## Variables de entorno (`backend/.env`)

Ver `backend/.env.example`. Ya están cargados los valores reales de MongoDB Atlas, Cloudinary y
`JWT_SECRET`. **Todavía vacíos** (con placeholders): `MERCADOPAGO_ACCESS_TOKEN`,
`MERCADOPAGO_PUBLIC_KEY`, `SMTP_USER`, `SMTP_APP_PASSWORD`, `ADMIN_ALERT_EMAIL`.

**Importante**: `backend/.env` contiene credenciales reales y está excluido de git vía `.gitignore`.
Nunca lo subas a un repositorio ni lo compartas.

## Autenticación (Fase 2a)

- El JWT viaja en el body de `/api/auth/login` y `/api/auth/register`, y el frontend lo guarda en
  `useUserStore` (Zustand + persist en localStorage), enviándolo como `Authorization: Bearer` en
  cada request (`frontend/src/lib/api.js`).
- `ProtectedRoute` (`frontend/src/components/auth/ProtectedRoute.jsx`) redirige a `/login` si no
  hay sesión; acepta una prop `role` para restringir por rol (usado en `/admin`).
- Passwords hasheados con bcryptjs; nunca se devuelven en las respuestas de la API.

## Panel admin (Fase 2b)

- Accesible en `/admin` (solo visible/permitido para usuarios con `rol: 'admin'`; el Navbar
  desktop muestra un link "Admin" cuando corresponde).
- Todas las rutas `/api/admin/*` están protegidas con `protect` + `authorize('admin')`
  (`backend/src/routes/admin.routes.js`).
- Carga de imágenes: `POST /api/admin/uploads` recibe un archivo (multer, memoria) y lo sube a
  Cloudinary vía `upload_stream`, devolviendo la URL real — usado tanto para imágenes de productos
  (mínimo 1, se recomiendan 3) como para banners de promociones.
- Dashboard: total de productos activos, promociones activas, y listado de productos con stock
  bajo (`stock <= umbralStockBajo`) o agotados (`stock === 0`).

## Checkout y stock (Fase 2c)

- **Modo simulado**: mientras `MERCADOPAGO_ACCESS_TOKEN` esté vacío, `POST /api/orders` no llama a
  Mercado Pago real — crea el pedido igual, reserva el stock, y devuelve una URL propia
  (`/checkout/resultado?...&simulado=true`) con botones para simular "pago aprobado" / "pago
  rechazado" (`POST /api/orders/:id/simular`, solo habilitado para pedidos simulados). Cuando se
  cargue el token real, el mismo código (`backend/src/utils/mercadopago.js`) pasa a crear una
  preferencia real y a validar pagos vía `POST /api/orders/webhook`, sin cambios de código.
- **Stock**: `backend/src/utils/stockService.js` reserva stock de forma atómica
  (`findOneAndUpdate` condicionado a `stock >= cantidad`) al crear el pedido — evita condiciones de
  carrera entre compras simultáneas — y lo libera si el pago se rechaza/cancela. Si la cantidad
  pedida supera el stock disponible, la compra se rechaza con 409.
- **Alertas de stock bajo**: `backend/src/utils/mailer.js` (Nodemailer + Gmail SMTP) envía un email
  a `ADMIN_ALERT_EMAIL` cuando un producto cruza su `umbralStockBajo` por una venta. Sin
  `SMTP_USER`/`SMTP_APP_PASSWORD` configurados, solo lo loguea en consola (no rompe la compra).

## Gestión de pedidos (Fase 2d)

- `/admin/pedidos`: lista todos los pedidos (`GET /api/admin/orders`, con `populate` del cliente),
  filtro por estado, y un `<select>` por fila para cambiar el estado
  (`PUT /api/admin/orders/:id/estado`). Si el admin cancela un pedido que no estaba cancelado, se
  libera el stock reservado. Cada cambio de estado dispara `enviarNotificacionPedido`
  (`backend/src/utils/mailer.js`) al email del cliente (mismo comportamiento de log-only sin SMTP
  configurado).
- `/mi-cuenta`: sección "Mis pedidos" con `GET /api/orders/mine` (solo los pedidos del usuario
  logueado), estado con badge de color, y botón "Volver a comprar" que repone esos productos en el
  carrito (`useCartStore`) y navega a `/carrito`.

## Qué falta

- Cargar credenciales reales de Mercado Pago y Gmail SMTP cuando estén disponibles (el código ya
  está listo para ambas, solo falta completar el `.env`).
- Guía de talles / comparador de armazones (mencionado como mejora en el pedido original, fuera del
  núcleo de e-commerce).
- Gestión de usuarios en el admin (listado de clientes) — marcada como opcional en el pedido
  original.
# opticaSol
# opticaSol
