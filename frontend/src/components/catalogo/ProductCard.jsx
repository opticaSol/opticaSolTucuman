import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../ui/Badge';
import PriceTag from '../ui/PriceTag';
import WhatsAppButton from '../ui/WhatsAppButton';
import { CATEGORIA_LABEL } from '../../lib/formatters';
import { getThumbnail } from '../../lib/media';

export default function ProductCard({ product, className = '', imageFit = 'contain' }) {
  // Carga masiva sin completar todavía: mientras tenga el nombre de relleno,
  // no hay ficha real que mostrar. Usamos la categoría como título provisorio.
  const esBorrador = product.nombre === 'Producto sin nombre';
  const nombreMostrado = esBorrador ? CATEGORIA_LABEL[product.categoria] : product.nombre;
  const thumbnail = getThumbnail(product);
  const fitClass = imageFit === 'cover' ? 'object-cover' : 'object-contain';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className={`group relative flex flex-col rounded-xl2 border border-sol-blanco/10 shadow-card overflow-hidden bg-sol-negro ${className}`}
    >
      <Link to={`/producto/${product._id}`} className="flex flex-col flex-1">
        <div className="relative aspect-square bg-sol-blanco overflow-hidden">
          {thumbnail?.isVideo ? (
            <video
              src={thumbnail.url}
              muted
              playsInline
              className={`w-full h-full ${fitClass} bg-sol-blanco group-hover:scale-105 transition-transform duration-300`}
            />
          ) : (
            <img
              src={thumbnail?.url}
              alt={nombreMostrado}
              loading="lazy"
              className={`w-full h-full ${fitClass} bg-sol-blanco group-hover:scale-105 transition-transform duration-300`}
            />
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {product.badges?.map((b) => (
              <Badge key={b} label={b} />
            ))}
          </div>
        </div>

        {/* Se reserva siempre este bloque para que todas las tarjetas midan lo
            mismo, tengan o no ficha completa todavía. */}
        <div className="p-4 flex flex-col gap-1 flex-1 min-h-[104px]">
          {product.marca !== 'Sin marca' && (
            <span className="text-xs uppercase tracking-wide text-sol-blanco/50">
              {product.marca}
            </span>
          )}
          <h3 className="font-display font-bold leading-tight line-clamp-2">{nombreMostrado}</h3>
          {(product.mostrarPrecio === false || product.precio > 0) && (
            <div className="mt-auto pt-2">
              <PriceTag
                precio={product.precio}
                precioDescuento={product.precioDescuento}
                mostrarPrecio={product.mostrarPrecio}
              />
            </div>
          )}
        </div>
      </Link>

      <div className="m-4 mt-0">
        <WhatsAppButton product={product} label="Consultar por WhatsApp" onClick={(e) => e.stopPropagation()} />
      </div>
    </motion.div>
  );
}
