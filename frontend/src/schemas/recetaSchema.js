import { z } from 'zod';
import { NOMBRE_REGEX, NOMBRE_REGEX_MSG } from '../lib/validation';

export const recetaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Ingresá tu nombre completo')
    .max(80, 'El nombre es demasiado largo (máximo 80 caracteres)')
    .regex(NOMBRE_REGEX, NOMBRE_REGEX_MSG),
  contacto: z
    .string()
    .trim()
    .min(6, 'Dejanos un email o teléfono válido')
    .max(100, 'Es demasiado largo'),
  comentario: z.string().trim().max(500, 'El comentario es demasiado largo (máximo 500 caracteres)').optional().or(z.literal('')),
  archivo: z
    .instanceof(FileList)
    .refine((list) => list.length > 0, 'Adjuntá una foto o PDF de tu receta')
    .refine((list) => !list[0] || list[0].size <= 8 * 1024 * 1024, 'El archivo no puede pesar más de 8MB'),
});
