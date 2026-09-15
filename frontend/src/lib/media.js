const VIDEO_EXT_RE = /\.(mp4|mov|webm|ogg|avi|mkv|m4v)(\?.*)?$/i;

// Por las dudas: URLs de video que quedaron guardadas por error en un campo
// de imágenes (ej. carga masiva) no deben intentar renderizarse con <img>.
export function isVideoUrl(url) {
  if (!url) return false;
  return url.includes('/video/upload/') || VIDEO_EXT_RE.test(url);
}

// Primer archivo disponible para usar como portada/miniatura de un producto,
// sea imagen o video (por si el producto no tiene ninguna imagen cargada).
export function getThumbnail(product) {
  const primeraImagen = product?.imagenes?.[0];
  if (primeraImagen) {
    return { url: primeraImagen, isVideo: isVideoUrl(primeraImagen) };
  }
  const primerVideo = product?.videos?.[0];
  if (primerVideo) {
    return { url: primerVideo, isVideo: true };
  }
  return null;
}
