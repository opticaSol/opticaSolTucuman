import { z } from 'zod';

export const productSchema = z
  .object({
    nombre: z.string().min(2, 'El nombre es obligatorio'),
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
    marca: z.string().min(1, 'La marca es obligatoria'),
    precio: z.coerce.number().min(0, 'El precio debe ser mayor o igual a 0'),
    precioDescuento: z.coerce.number().min(0).optional().or(z.literal('')),
    stock: z.coerce.number().int().min(0, 'El stock debe ser mayor o igual a 0'),
    umbralStockBajo: z.coerce.number().int().min(0).default(5),
    imagenes: z.array(z.string().url()).min(1, 'Necesitás al menos una imagen'),
    videos: z.array(z.string().url()).optional().default([]),
    descripcion: z.string().optional(),
    materiales: z.string().optional(),
    proteccionUV: z.boolean().optional(),
    irrompible: z.boolean().optional(),
    colorArmazon: z.string().optional(),
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
