import { z } from 'zod';

export const heroSlideSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, 'El título es obligatorio')
    .max(100, 'El título es demasiado largo (máximo 100 caracteres)'),
  subtitulo: z.string().trim().max(150, 'El subtítulo es demasiado largo').optional().or(z.literal('')),
  imagen: z.string().url('Subí una imagen'),
  mensajeWhatsApp: z
    .string()
    .trim()
    .min(1, 'El mensaje de WhatsApp es obligatorio')
    .max(300, 'El mensaje es demasiado largo (máximo 300 caracteres)'),
  orden: z.coerce.number().int().min(0).max(9999).optional(),
  activo: z.boolean().optional(),
});
