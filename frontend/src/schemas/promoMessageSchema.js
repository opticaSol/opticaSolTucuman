import { z } from 'zod';

export const promoMessageSchema = z.object({
  texto: z
    .string()
    .trim()
    .min(1, 'El mensaje es obligatorio')
    .max(1000, 'El mensaje es demasiado largo (máximo 1000 caracteres)')
    .refine((v) => v.includes('{nombre}'), 'El mensaje tiene que incluir {nombre}'),
});
