import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, fetchRelatedProducts } from '../lib/api';
import { CATEGORIA_LABEL } from '../lib/formatters';
import GaleriaImagenes from '../components/producto/GaleriaImagenes';
import CrossSell from '../components/producto/CrossSell';
import Badge from '../components/ui/Badge';
import PriceTag from '../components/ui/PriceTag';
import WhatsAppButton from '../components/ui/WhatsAppButton';
import PageTransition from '../components/ui/PageTransition';

export default function ProductoDetalle() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    setProduct(null);
    setNotFound(false);
    fetchProductById(id)
      .then(setProduct)
      .catch(() => setNotFound(true));
    fetchRelatedProducts(id).then(setRelated).catch(() => setRelated([]));
    window.scrollTo(0, 0);
  }, [id]);

  if (notFound) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center flex flex-col items-center gap-4">
        <p className="text-sol-blanco/70">No encontramos este producto.</p>
        <Link
          to="/#catalogo"
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-5 py-2.5"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-6 py-12 text-center text-sol-blanco/60">Cargando...</div>;
  }

  const esBorrador = product.nombre === 'Producto sin nombre';
  const nombreMostrado = esBorrador ? CATEGORIA_LABEL[product.categoria] : product.nombre;

  return (
    <PageTransition className="max-w-6xl mx-auto px-6 py-8 pb-24">
      <div className="grid md:grid-cols-2 gap-10">
        <GaleriaImagenes imagenes={product.imagenes} videos={product.videos} alt={nombreMostrado} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {product.badges?.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>

          <h1 className="font-display font-black text-2xl md:text-3xl">{nombreMostrado}</h1>

          {(product.mostrarPrecio === false || product.precio > 0) && (
            <PriceTag
              precio={product.precio}
              precioDescuento={product.precioDescuento}
              mostrarPrecio={product.mostrarPrecio}
              size="lg"
            />
          )}

          {product.descripcion && <p className="text-sol-blanco/80 leading-relaxed">{product.descripcion}</p>}

          <div className="text-sm text-sol-blanco/70 flex flex-col gap-1">
            {product.materiales && <p>Material: {product.materiales}</p>}
            {product.colorArmazon && <p>Color: {product.colorArmazon}</p>}
            {product.proteccionUV && <p>Con protección UV</p>}
            <p>Categoría: {CATEGORIA_LABEL[product.categoria]}</p>
          </div>

          <div className="mt-2">
            <WhatsAppButton product={product} size="lg" label="Consultar por WhatsApp" />
          </div>
        </div>
      </div>

      <CrossSell products={related} />
    </PageTransition>
  );
}
