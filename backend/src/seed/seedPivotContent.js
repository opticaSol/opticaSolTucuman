// Crea (idempotente, por título/nombre) los 3 slides del hero y los 8
// productos nuevos pedidos en el pivot a catálogo con consulta por WhatsApp.
// Se crean SIN imagen/imágenes y con activo: false para no mostrar nada roto
// en el sitio en vivo: quedan listos para que el admin les suba la foto desde
// el panel y los active desde ahí (el checkbox "activo" / "Slide activo").
// Uso: node src/seed/seedPivotContent.js
require('dotenv').config();
const connectDB = require('../config/db');
const Product = require('../models/Product');
const HeroSlide = require('../models/HeroSlide');

const heroSlides = [
  {
    titulo: 'Todo tipo de cristales',
    subtitulo: 'Antirreflejo, Blue, HD, fotocromáticos y más, a medida de tu receta.',
    mensajeWhatsApp: 'Hola Óptica Sol! Quiero consultar por cristales para mis anteojos.',
    orden: 0,
  },
  {
    titulo: 'Repuestos para anteojos de sol',
    subtitulo: 'Varillas, plaquetas, cristales y todo lo que necesites para repararlos.',
    mensajeWhatsApp: 'Hola Óptica Sol! Quiero consultar por repuestos para mis anteojos de sol.',
    orden: 1,
  },
  {
    titulo: 'Reparación de anteojos',
    subtitulo: 'Le damos una segunda vida a tus anteojos de sol o de receta.',
    mensajeWhatsApp: 'Hola Óptica Sol! Quiero consultar por la reparación de mis anteojos.',
    orden: 2,
  },
];

const products = [
  {
    nombre: 'Lentes de contacto blandas de uso anual',
    categoria: 'contacto',
    tipoContacto: 'anual',
    usoAnual: true,
    marca: 'Sin marca',
    descripcion: 'Lentes de contacto blandas no descartables, de uso anual.',
  },
  {
    nombre: 'Lentes de contacto blandas tóricas de uso anual',
    categoria: 'contacto',
    tipoContacto: 'anual',
    usoAnual: true,
    marca: 'Sin marca',
    descripcion: 'Lentes de contacto blandas tóricas (para astigmatismo), no descartables, de uso anual.',
  },
  {
    nombre: 'Cristal antirreflejo',
    categoria: 'cristales',
    marca: 'Sin marca',
    descripcion: 'Cristal con tratamiento antirreflejo, reduce los reflejos y mejora la nitidez.',
  },
  {
    nombre: 'Cristal Blue',
    categoria: 'cristales',
    marca: 'Sin marca',
    descripcion: 'Cristal con filtro de luz azul, ideal para uso prolongado de pantallas.',
  },
  {
    nombre: 'Cristal HD',
    categoria: 'cristales',
    marca: 'Sin marca',
    descripcion: 'Cristal de alta definición, mayor nitidez y amplitud de visión.',
  },
  {
    nombre: 'Cristal fotocromático',
    categoria: 'cristales',
    marca: 'Sin marca',
    descripcion: 'Cristal que se oscurece automáticamente con la luz solar.',
  },
  {
    nombre: 'Cristal fotocromático + antirreflejo',
    categoria: 'cristales',
    marca: 'Sin marca',
    descripcion: 'Cristal fotocromático con tratamiento antirreflejo incluido.',
  },
  {
    nombre: 'Cristal fotocromático Blue',
    categoria: 'cristales',
    marca: 'Sin marca',
    descripcion: 'Cristal fotocromático con filtro de luz azul.',
  },
];

async function main() {
  await connectDB();

  for (const data of heroSlides) {
    const slide = await HeroSlide.findOneAndUpdate(
      { titulo: data.titulo },
      { $setOnInsert: { ...data, imagen: '', activo: false } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: false }
    );
    console.log(`Hero slide listo: ${slide.titulo}`);
  }

  for (const data of products) {
    const product = await Product.findOneAndUpdate(
      { nombre: data.nombre },
      { $setOnInsert: { ...data, precio: 0, mostrarPrecio: false, imagenes: [], activo: false } },
      { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: false }
    );
    console.log(`Producto listo: ${product.nombre}`);
  }

  console.log('\nListo. Todo se creó como INACTIVO (sin imagen todavía).');
  console.log('Para publicar cada uno: Panel Admin -> subir la foto -> tildar "activo" -> Guardar.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error en el seed:', err);
  process.exit(1);
});
