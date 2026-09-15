import { z } from 'zod';

export const productSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(2, 'El nombre es obligatorio')
      .max(120, 'El nombre es demasiado largo (máximo 120 caracteres)'),
    categoria: z.enum(['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes'], {
      errorMap: () => ({ message: 'Elegí una categoría' }),
    }),
    subcategoriaGenero: z.enum(['dama', 'caballero', 'niños']).optional().or(z.literal('')),
    tipoContacto: z
      .enum(['diarias', 'mensuales', 'toricas', 'color'])
      .optional()
      .or(z.literal('')),
    tipoLenteRecetado: z
      .enum(['multifocales', 'bifocales', 'ocupacionales', 'monofocales'])
      .optional()
      .or(z.literal('')),
    marca: z.string().trim().min(1, 'La marca es obligatoria').max(60, 'La marca es demasiado larga'),
    precio: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0').max(99999999, 'El precio es demasiado alto'),
    precioDescuento: z.coerce.number().min(0).max(99999999, 'El precio es demasiado alto').optional().or(z.literal('')),
    stock: z.coerce.number().int().min(0, 'El stock debe ser mayor o igual a 0').max(999999, 'El stock es demasiado alto'),
    umbralStockBajo: z.coerce.number().int().min(0).max(999999).default(5),
    imagenes: z.array(z.string().url()).min(1, 'Necesitás al menos una imagen'),
    videos: z.array(z.string().url()).optional().default([]),
    descripcion: z.string().trim().max(1000, 'La descripción es demasiado larga (máximo 1000 caracteres)').optional().or(z.literal('')),
    materiales: z.string().trim().max(200, 'Es demasiado largo').optional().or(z.literal('')),
    proteccionUV: z.boolean().optional(),
    irrompible: z.boolean().optional(),
    colorArmazon: z.string().trim().max(60, 'Es demasiado largo').optional().or(z.literal('')),
    activo: z.boolean().optional(),
    destacado: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.categoria === 'recetados' && !data.tipoLenteRecetado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Elegí el tipo de lente recetado',
        path: ['tipoLenteRecetado'],
      });
    }
  });
