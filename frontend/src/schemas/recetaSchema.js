import { z } from 'zod';

export const recetaSchema = z.object({
  nombre: z.string().min(2, 'Ingresá tu nombre completo'),
  contacto: z.string().min(6, 'Dejanos un email o teléfono válido'),
  comentario: z.string().optional(),
  archivo: z
    .instanceof(FileList)
    .refine((list) => list.length > 0, 'Adjuntá una foto o PDF de tu receta')
    .refine((list) => !list[0] || list[0].size <= 8 * 1024 * 1024, 'El archivo no puede pesar más de 8MB'),
});
