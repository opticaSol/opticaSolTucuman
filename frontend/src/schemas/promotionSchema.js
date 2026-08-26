import { z } from 'zod';

export const promotionSchema = z
  .object({
    titulo: z.string().min(2, 'El título es obligatorio'),
    descripcion: z.string().optional(),
    tipoDescuento: z.enum(['porcentaje', 'monto'], {
      errorMap: () => ({ message: 'Elegí un tipo de descuento' }),
    }),
    valor: z.coerce.number().min(0, 'El valor debe ser mayor o igual a 0'),
    fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
    fechaFin: z.string().optional().or(z.literal('')),
    bannerImagen: z.string().url('Subí un banner'),
    categoriasIncluidas: z.array(z.enum(['sol', 'contacto', 'recetados'])).optional(),
    activa: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fechaFin && new Date(data.fechaFin) < new Date(data.fechaInicio)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'La fecha de fin no puede ser anterior al inicio',
        path: ['fechaFin'],
      });
    }
  });
