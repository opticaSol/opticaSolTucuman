import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { fetchProductById, fetchRelatedProducts } from '../lib/api';
import { useCartStore } from '../store/useCartStore';
import GaleriaImagenes from '../components/producto/GaleriaImagenes';
import StickyAddToCart from '../components/producto/StickyAddToCart';
import CrossSell from '../components/producto/CrossSell';
import Badge from '../components/ui/Badge';
import PriceTag from '../components/ui/PriceTag';
import PageTransition from '../components/ui/PageTransition';

export default function ProductoDetalle() {
  const { id } = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [showSticky, setShowSticky] = useState(false);
  const addToCartRef = useRef(null);

  useEffect(() => {
    setProduct(null);
    fetchProductById(id).then(setProduct);
    fetchRelatedProducts(id).then(setRelated).catch(() => setRelated([]));
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    function onScroll() {
      if (!addToCartRef.current) return;
      const rect = addToCartRef.current.getBoundingClientRect();
      setShowSticky(rect.bottom < 0);
    }
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [product]);

  function handleAddToCart() {
    if (!product) return;
    addItem(product, 1);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Agregado al carrito',
      text: product.nombre,
      showConfirmButton: false,
      timer: 1800,
      background: '#0D0D0D',
      color: '#FFFFFF',
    });
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-6 py-12 text-center text-sol-blanco/60">Cargando...</div>;
  }

  return (
    <PageTransition className="max-w-6xl mx-auto px-6 py-8 pb-24">
      <div className="grid md:grid-cols-2 gap-10">
        <GaleriaImagenes imagenes={product.imagenes} alt={product.nombre} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            {product.badges?.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>

          <span className="text-sm uppercase tracking-wide text-sol-blanco/50">{product.marca}</span>
          <h1 className="font-display font-black text-2xl md:text-3xl">{product.nombre}</h1>

          <PriceTag precio={product.precio} precioDescuento={product.precioDescuento} size="lg" />

          <p className="text-sol-blanco/80 leading-relaxed">{product.descripcion}</p>

          <div className="text-sm text-sol-blanco/70 flex flex-col gap-1">
            {product.materiales && <p>Material: {product.materiales}</p>}
            {product.colorArmazon && <p>Color: {product.colorArmazon}</p>}
            {product.proteccionUV && <p>Con protección UV</p>}
          </div>

          <motion.button
            ref={addToCartRef}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            whileHover={{ scale: product.stock === 0 ? 1 : 1.02 }}
            whileTap={{ scale: product.stock === 0 ? 1 : 0.97 }}
            className="mt-2 rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3.5 disabled:opacity-40"
          >
            {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
          </motion.button>
        </div>
      </div>

      <CrossSell products={related} />

      <StickyAddToCart product={product} visible={showSticky} onAdd={handleAddToCart} />
    </PageTransition>
  );
}
