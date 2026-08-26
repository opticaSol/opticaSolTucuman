import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Ingresá un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const registerSchema = z
  .object({
    nombre: z.string().min(2, 'Ingresá tu nombre completo'),
    email: z.string().min(1, 'El email es obligatorio').email('Ingresá un email válido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmá tu contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export const profileSchema = z.object({
  nombre: z.string().min(2, 'Ingresá tu nombre completo'),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});
