require('dotenv').config();

const connectDB = require('../config/db');
const Product = require('../models/Product');
const Promotion = require('../models/Promotion');

// Fotos reales (Unsplash, verificadas), usadas como stand-in hasta que se suban
// fotos propias de los productos reales desde el panel admin.
const SOL_PHOTOS = [
  'https://images.unsplash.com/photo-1577803645773-f96470509666?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&h=800&fit=crop&auto=format&q=80',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800&h=800&fit=crop&auto=format&q=80',
];

const RECETADOS_PHOTO =
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=800&h=800&fit=crop&auto=format&q=80';

// Sin foto de producto real de lentes de contacto disponible: se reutilizan
// fotos reales de armazones (mismo criterio de marca) hasta subir fotos propias.
const CONTACTO_PHOTOS = [SOL_PHOTOS[2], RECETADOS_PHOTO];

function fotosContacto(i) {
  const foto = CONTACTO_PHOTOS[i % CONTACTO_PHOTOS.length];
  return [foto, foto, foto];
}

const marcasSol = ['RayBan', 'Vulk', 'Infinit', 'Prada', 'Oakley'];
const marcasRecetados = ['Vulk', 'Infinit', 'Stepper', 'Fila', 'Kipling'];
const marcasContacto = ['Acuvue', 'Biofinity', 'FreshLook', 'Air Optix'];
const coloresArmazon = ['Negro', 'Carey', 'Dorado', 'Transparente', 'Rojo'];

function buildSolYRecetados(categoria, marcas) {
  const generos = ['dama', 'caballero', 'niños'];
  const items = [];
  let i = 0;
  for (const genero of generos) {
    for (let n = 0; n < 3; n++) {
      i++;
      const marca = marcas[i % marcas.length];
      const color = coloresArmazon[i % coloresArmazon.length];
      const precio = categoria === 'sol' ? 45000 + i * 3500 : 60000 + i * 4200;
      const conDescuento = i % 3 === 0;
      const foto = categoria === 'sol' ? SOL_PHOTOS[i % SOL_PHOTOS.length] : RECETADOS_PHOTO;
      items.push({
        nombre: `${categoria === 'sol' ? 'Lente de sol' : 'Armazón recetado'} ${marca} ${genero} #${n + 1}`,
        categoria,
        subcategoriaGenero: genero,
        tipoContacto: null,
        marca,
        precio,
        precioDescuento: conDescuento ? Math.round(precio * 0.8) : null,
        stock: i % 5 === 0 ? 2 : 15 - (i % 7),
        umbralStockBajo: 5,
        imagenes: [foto, foto, foto],
        descripcion: `${categoria === 'sol' ? 'Lente de sol' : 'Armazón para lentes recetados'} ${marca}, línea ${genero}, con terminaciones premium.`,
        materiales: n % 2 === 0 ? 'Acetato' : 'Metal liviano',
        proteccionUV: categoria === 'sol',
        colorArmazon: color,
        ventasCount: (i * 7) % 40,
        activo: true,
      });
    }
  }
  return items;
}

function buildContacto() {
  const tipos = ['diarias', 'mensuales', 'toricas', 'color'];
  const items = [];
  tipos.forEach((tipo, i) => {
    for (let n = 0; n < 2; n++) {
      const marca = marcasContacto[(i + n) % marcasContacto.length];
      const precio = 18000 + i * 2500 + n * 1000;
      items.push({
        nombre: `Lentes de contacto ${marca} ${tipo} caja x30`,
        categoria: 'contacto',
        subcategoriaGenero: null,
        tipoContacto: tipo,
        marca,
        precio,
        precioDescuento: n === 0 ? Math.round(precio * 0.85) : null,
        stock: n === 0 ? 4 : 20,
        umbralStockBajo: 5,
        imagenes: fotosContacto(i),
        descripcion: `Lentes de contacto ${tipo} de ${marca}, caja por 30 unidades.`,
        materiales: 'Hidrogel de silicona',
        proteccionUV: false,
        colorArmazon: '',
        ventasCount: (i * 11) % 40,
        activo: true,
      });
    }
  });
  return items;
}

async function seed() {
  await connectDB();

  const products = [
    ...buildSolYRecetados('sol', marcasSol),
    ...buildSolYRecetados('recetados', marcasRecetados),
    ...buildContacto(),
  ];

  await Product.deleteMany({});
  const inserted = await Product.insertMany(products);
  console.log(`Productos insertados: ${inserted.length}`);

  const solDestacado = inserted.find((p) => p.categoria === 'sol');
  const recetadoDestacado = inserted.find((p) => p.categoria === 'recetados');

  const now = new Date();
  const en10Dias = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);
  const en3Dias = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  const promotions = [
    {
      titulo: '2x1 en Lentes de Sol',
      descripcion: 'Llevate el segundo par de lentes de sol gratis en toda la tienda.',
      tipoDescuento: 'porcentaje',
      valor: 50,
      fechaInicio: now,
      fechaFin: en10Dias,
      bannerImagen:
        'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1600&h=600&fit=crop&auto=format&q=80',
      categoriasIncluidas: ['sol'],
      productosIncluidos: [],
      activa: true,
    },
    {
      titulo: 'Recetados + funda de regalo',
      descripcion: 'En la compra de tu armazón recetado te llevás una funda de regalo.',
      tipoDescuento: 'monto',
      valor: 5000,
      fechaInicio: now,
      fechaFin: en3Dias,
      bannerImagen:
        'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=1600&h=600&fit=crop&auto=format&q=80',
      categoriasIncluidas: ['recetados'],
      productosIncluidos: [],
      activa: true,
    },
    {
      titulo: '10% OFF pagando en efectivo o transferencia',
      descripcion: 'Válido en toda la tienda, todos los días.',
      tipoDescuento: 'porcentaje',
      valor: 10,
      fechaInicio: now,
      fechaFin: null,
      bannerImagen:
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1600&h=600&fit=crop&auto=format&q=80',
      categoriasIncluidas: [],
      productosIncluidos: [solDestacado._id, recetadoDestacado._id].filter(Boolean),
      activa: true,
    },
  ];

  await Promotion.deleteMany({});
  const insertedPromos = await Promotion.insertMany(promotions);
  console.log(`Promociones insertadas: ${insertedPromos.length}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Error al seedear la base de datos:', err);
  process.exit(1);
});
