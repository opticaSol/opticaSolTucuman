import { z } from 'zod';

export const promotionSchema = z
  .object({
    titulo: z
      .string()
      .trim()
      .min(2, 'El título es obligatorio')
      .max(100, 'El título es demasiado largo (máximo 100 caracteres)'),
    descripcion: z
      .string()
      .trim()
      .max(500, 'La descripción es demasiado larga (máximo 500 caracteres)')
      .optional()
      .or(z.literal('')),
    tipoDescuento: z.enum(['porcentaje', 'monto'], {
      errorMap: () => ({ message: 'Elegí un tipo de descuento' }),
    }),
    valor: z.coerce.number().min(0, 'El valor debe ser mayor o igual a 0').max(999999, 'El valor es demasiado alto'),
    fechaInicio: z.string().min(1, 'La fecha de inicio es obligatoria'),
    fechaFin: z.string().optional().or(z.literal('')),
    bannerImagen: z.string().url('Subí un banner'),
    categoriasIncluidas: z
      .array(z.enum(['sol', 'contacto', 'recetados', 'armazones', 'liquidos', 'colgantes']))
      .optional(),
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
