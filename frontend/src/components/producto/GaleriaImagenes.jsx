import { useState } from 'react';

export default function GaleriaImagenes({ imagenes = [], alt }) {
  const [activa, setActiva] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-square rounded-xl2 overflow-hidden bg-sol-blanco/5 border border-sol-blanco/10">
        <img src={imagenes[activa]} alt={alt} className="w-full h-full object-cover" />
      </div>
      {imagenes.length > 1 && (
        <div className="flex gap-2">
          {imagenes.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActiva(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                activa === i ? 'border-sol-amarillo' : 'border-transparent opacity-70'
              }`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
