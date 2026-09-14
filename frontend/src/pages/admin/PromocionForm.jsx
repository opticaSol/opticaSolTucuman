import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { promotionSchema } from '../../schemas/promotionSchema';
import { fetchAdminPromotion, createPromotion, updatePromotion } from '../../lib/api';
import ImageUploader from '../../components/admin/ImageUploader';

const CATEGORIAS = [
  { value: 'sol', label: 'Anteojos de Sol' },
  { value: 'contacto', label: 'Lentes de Contacto' },
  { value: 'recetados', label: 'Lentes Recetados' },
  { value: 'armazones', label: 'Armazones de Receta' },
  { value: 'liquidos', label: 'Líquidos' },
  { value: 'colgantes', label: 'Colgantes' },
];

function toDateInput(value) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

const emptyValues = {
  titulo: '',
  descripcion: '',
  tipoDescuento: 'porcentaje',
  valor: 0,
  fechaInicio: toDateInput(new Date()),
  fechaFin: '',
  bannerImagen: '',
  categoriasIncluidas: [],
  activa: true,
};

export default function PromocionForm() {
  const { id } = useParams();
  const isNew = !id || id === 'nueva';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(promotionSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (isNew) return;
    fetchAdminPromotion(id).then((promo) => {
      reset({
        ...emptyValues,
        ...promo,
        fechaInicio: toDateInput(promo.fechaInicio),
        fechaFin: toDateInput(promo.fechaFin),
      });
      setLoading(false);
    });
  }, [id, isNew, reset]);

  async function onSubmit(values) {
    const payload = {
      ...values,
      fechaFin: values.fechaFin || null,
    };

    try {
      if (isNew) {
        await createPromotion(payload);
      } else {
        await updatePromotion(id, payload);
      }
      Swal.fire({
        icon: 'success',
        title: isNew ? 'Promoción creada' : 'Promoción actualizada',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/admin/promociones');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos guardar la promoción',
        text: err.response?.data?.message || 'Revisá los datos e intentá de nuevo',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  if (loading) return <p className="text-sol-blanco/60">Cargando...</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display font-black text-2xl uppercase mb-6">
        {isNew ? 'Nueva promoción' : 'Editar promoción'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Título" error={errors.titulo?.message}>
          <input {...register('titulo')} className="input" />
        </Field>

        <Field label="Descripción">
          <textarea {...register('descripcion')} rows={2} className="input" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tipo de descuento" error={errors.tipoDescuento?.message}>
            <select {...register('tipoDescuento')} className="input">
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto">Monto fijo ($)</option>
            </select>
          </Field>
          <Field label="Valor" error={errors.valor?.message}>
            <input type="number" step="0.01" {...register('valor')} className="input" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Fecha de inicio" error={errors.fechaInicio?.message}>
            <input type="date" {...register('fechaInicio')} className="input" />
          </Field>
          <Field label="Fecha de fin (opcional)" error={errors.fechaFin?.message}>
            <input type="date" {...register('fechaFin')} className="input" />
          </Field>
        </div>

        <Field label="Categorías incluidas (opcional, vacío = todas)">
          <div className="flex gap-4">
            {CATEGORIAS.map((c) => (
              <label key={c.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" value={c.value} {...register('categoriasIncluidas')} />
                {c.label}
              </label>
            ))}
          </div>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('activa')} />
          Promoción activa
        </label>

        <Field label="Banner" error={errors.bannerImagen?.message}>
          <Controller
            name="bannerImagen"
            control={control}
            render={({ field }) => (
              <ImageUploader
                images={field.value ? [field.value] : []}
                onChange={(imgs) => field.onChange(imgs[imgs.length - 1] || '')}
                tipo="promos"
                multiple={false}
              />
            )}
          />
        </Field>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : isNew ? 'Crear promoción' : 'Guardar cambios'}
        </motion.button>
      </form>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-sol-rojo mt-1">{error}</p>}
    </div>
  );
}
