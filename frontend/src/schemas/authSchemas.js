import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .max(254, 'El email es demasiado largo')
    .email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria').max(72, 'La contraseña es demasiado larga'),
});
