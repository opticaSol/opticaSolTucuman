import { z } from 'zod';
import { NOMBRE_REGEX, NOMBRE_REGEX_MSG } from '../lib/validation';
import { normalizeArgentinePhone, isValidArgentinePhone } from '../lib/phone';

export const quickAddClientSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Ingresá el nombre')
    .max(100, 'El nombre es demasiado largo (máximo 100 caracteres)')
    .regex(NOMBRE_REGEX, NOMBRE_REGEX_MSG),
  whatsapp: z
    .string()
    .trim()
    .min(1, 'Ingresá el WhatsApp')
    .refine((v) => isValidArgentinePhone(normalizeArgentinePhone(v)), 'Ingresá un WhatsApp válido'),
});

export const editClientSchema = quickAddClientSchema.extend({
  aceptaPromos: z.boolean().optional(),
});
