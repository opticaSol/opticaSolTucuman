import { useState } from 'react';
import { isVideoUrl } from '../../lib/media';

export default function GaleriaImagenes({ imagenes = [], videos = [], alt }) {
  // Por las dudas: alguna URL puede haber quedado guardada en "imagenes"
  // siendo en realidad un video (ej. carga masiva antes de este arreglo).
  const items = [
    ...imagenes.map((url) => ({ url, tipo: isVideoUrl(url) ? 'video' : 'imagen' })),
    ...videos.map((url) => ({ url, tipo: 'video' })),
  ];
  const [activa, setActiva] = useState(0);
  const actual = items[activa] || items[0];

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`rounded-xl2 overflow-hidden bg-sol-blanco border border-sol-blanco/10 ${
          actual?.tipo === 'video' ? 'aspect-video' : 'aspect-square'
        }`}
      >
        {actual?.tipo === 'video' ? (
          <video
            key={actual.url}
            src={actual.url}
            controls
            playsInline
            className="w-full h-full object-contain bg-sol-blanco"
          />
        ) : (
          <img src={actual?.url} alt={alt} className="w-full h-full object-contain" />
        )}
      </div>
      {items.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {items.map((item, i) => (
            <button
              key={item.url + i}
              onClick={() => setActiva(i)}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition bg-sol-blanco ${
                activa === i ? 'border-sol-amarillo' : 'border-transparent opacity-70'
              }`}
            >
              {item.tipo === 'video' ? (
                <>
                  <video src={item.url} className="w-full h-full object-cover" muted />
                  <span className="absolute inset-0 flex items-center justify-center bg-sol-negro/40">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-sol-blanco">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </>
              ) : (
                <img src={item.url} alt={`${alt} ${i + 1}`} className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
