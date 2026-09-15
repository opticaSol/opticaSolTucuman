import { z } from 'zod';
import { NOMBRE_REGEX, NOMBRE_REGEX_MSG, TELEFONO_REGEX, TELEFONO_REGEX_MSG } from '../lib/validation';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .max(254, 'El email es demasiado largo')
    .email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria').max(72, 'La contraseña es demasiado larga'),
});

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, 'Ingresá tu nombre completo')
      .max(80, 'El nombre es demasiado largo (máximo 80 caracteres)')
      .regex(NOMBRE_REGEX, NOMBRE_REGEX_MSG),
    email: z
      .string()
      .min(1, 'El email es obligatorio')
      .max(254, 'El email es demasiado largo')
      .email('Ingresá un email válido'),
    password: z
      .string()
      .min(6, 'La contraseña debe tener al menos 6 caracteres')
      .max(72, 'La contraseña es demasiado larga (máximo 72 caracteres)'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Ingresá tu nombre completo')
    .max(80, 'El nombre es demasiado largo (máximo 80 caracteres)')
    .regex(NOMBRE_REGEX, NOMBRE_REGEX_MSG),
  telefono: z
    .string()
    .trim()
    .max(20, 'El teléfono es demasiado largo')
    .regex(TELEFONO_REGEX, TELEFONO_REGEX_MSG)
    .optional()
    .or(z.literal('')),
  direccion: z.string().trim().max(200, 'La dirección es demasiado larga').optional().or(z.literal('')),
});
