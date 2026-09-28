import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { heroSlideSchema } from '../../schemas/heroSlideSchema';
import { fetchAdminHeroSlide, createHeroSlide, updateHeroSlide } from '../../lib/api';
import ImageUploader from '../../components/admin/ImageUploader';

const emptyValues = {
  titulo: '',
  subtitulo: '',
  imagen: '',
  mensajeWhatsApp: '',
  orden: 0,
  activo: true,
};

export default function HeroSlideForm() {
  const { id } = useParams();
  const isNew = !id || id === 'nuevo';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!isNew);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(heroSlideSchema), defaultValues: emptyValues });

  useEffect(() => {
    if (isNew) return;
    fetchAdminHeroSlide(id).then((slide) => {
      reset({ ...emptyValues, ...slide });
      setLoading(false);
    });
  }, [id, isNew, reset]);

  async function onSubmit(values) {
    try {
      if (isNew) {
        await createHeroSlide(values);
      } else {
        await updateHeroSlide(id, values);
      }
      Swal.fire({
        icon: 'success',
        title: isNew ? 'Slide creado' : 'Slide actualizado',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/admin/hero-slides');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos guardar el slide',
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
        {isNew ? 'Nuevo slide' : 'Editar slide'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Field label="Título" error={errors.titulo?.message}>
          <input {...register('titulo')} className="input" />
        </Field>

        <Field label="Subtítulo (opcional)" error={errors.subtitulo?.message}>
          <input {...register('subtitulo')} className="input" />
        </Field>

        <Field label="Mensaje de WhatsApp" error={errors.mensajeWhatsApp?.message}>
          <textarea {...register('mensajeWhatsApp')} rows={2} className="input" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Orden" error={errors.orden?.message}>
            <input type="number" {...register('orden')} className="input" />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('activo')} />
          Slide activo (visible en el hero)
        </label>

        <Field label="Imagen" error={errors.imagen?.message}>
          <Controller
            name="imagen"
            control={control}
            render={({ field }) => (
              <ImageUploader
                images={field.value ? [field.value] : []}
                onChange={(imgs) => field.onChange(imgs[imgs.length - 1] || '')}
                tipo="hero"
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
          {isSubmitting ? 'Guardando...' : isNew ? 'Crear slide' : 'Guardar cambios'}
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
