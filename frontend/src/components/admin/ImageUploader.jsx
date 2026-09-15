import { useRef, useState } from 'react';
import { uploadImage } from '../../lib/api';
import { isVideoUrl } from '../../lib/media';

export default function ImageUploader({
  images,
  onChange,
  tipo = 'productos',
  multiple = true,
  kind = 'imagen',
  allowPrincipal = false,
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const isVideo = kind === 'video';

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const { url } = await uploadImage(file, tipo);
        uploaded.push(url);
      }
      onChange(multiple ? [...images, ...uploaded] : uploaded);
    } catch (err) {
      alert(err.response?.data?.message || `Error al subir el ${isVideo ? 'video' : 'archivo'}`);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeImage(url) {
    onChange(images.filter((img) => img !== url));
  }

  function makePrincipal(url) {
    onChange([url, ...images.filter((img) => img !== url)]);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {images.map((url, i) => (
          <div key={url} className="relative w-20 h-20 rounded-lg overflow-hidden border border-sol-blanco/20">
            {isVideo || isVideoUrl(url) ? (
              <video src={url} className="w-full h-full object-cover" muted />
            ) : (
              <img src={url} alt="" className="w-full h-full object-cover" />
            )}
            {allowPrincipal && i === 0 && (
              <span className="absolute bottom-0.5 left-0.5 bg-sol-amarillo text-sol-negro text-[9px] font-display font-bold px-1.5 py-0.5 rounded">
                Principal
              </span>
            )}
            {allowPrincipal && i !== 0 && (
              <button
                type="button"
                onClick={() => makePrincipal(url)}
                title="Marcar como principal"
                className="absolute bottom-0.5 left-0.5 bg-sol-negro/70 text-sol-blanco text-[9px] font-display font-bold px-1.5 py-0.5 rounded hover:bg-sol-amarillo hover:text-sol-negro transition-colors"
              >
                ★
              </button>
            )}
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-0.5 right-0.5 bg-sol-rojo text-sol-blanco text-xs w-5 h-5 rounded-full"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <label className="inline-flex items-center gap-2 rounded-full border border-dashed border-sol-blanco/30 px-4 py-2 text-sm cursor-pointer hover:border-sol-amarillo w-fit">
        {uploading ? 'Subiendo...' : multiple ? `Agregar ${isVideo ? 'videos' : 'imágenes'}` : 'Subir banner'}
        <input
          ref={inputRef}
          type="file"
          accept={isVideo ? 'video/*' : 'image/*'}
          multiple={multiple}
          onChange={handleFiles}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
