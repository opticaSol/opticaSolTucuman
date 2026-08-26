import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { recetaSchema } from '../schemas/recetaSchema';
import { submitReceta } from '../lib/api';
import PageTransition from '../components/ui/PageTransition';

export default function SubirReceta() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(recetaSchema) });

  async function onSubmit(values) {
    try {
      await submitReceta({
        nombre: values.nombre,
        contacto: values.contacto,
        comentario: values.comentario,
        archivo: values.archivo[0],
      });
      Swal.fire({
        icon: 'success',
        title: '¡Recibimos tu receta!',
        text: 'Te vamos a contactar con el presupuesto a la brevedad.',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
      });
      reset();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos enviar tu receta',
        text: err.response?.data?.message || 'Intentá de nuevo en unos minutos',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  return (
    <PageTransition className="max-w-lg mx-auto px-6 py-16">
      <p className="font-display font-bold text-sol-amarillo uppercase tracking-widest text-xs mb-2 text-center">
        Pedí tu presupuesto
      </p>
      <h1 className="font-display font-black text-3xl uppercase mb-3 text-center">Subí tu receta</h1>
      <p className="text-sm text-sol-blanco/60 mb-8 text-center">
        Sacale una foto o adjuntá el PDF de tu receta oftalmológica y te contactamos con el
        presupuesto de tus lentes.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">
            Nombre completo
          </label>
          <input {...register('nombre')} className="input" />
          {errors.nombre && <p className="text-xs text-sol-rojo mt-1">{errors.nombre.message}</p>}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">
            Email o teléfono
          </label>
          <input {...register('contacto')} placeholder="Para contactarte con el presupuesto" className="input" />
          {errors.contacto && <p className="text-xs text-sol-rojo mt-1">{errors.contacto.message}</p>}
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">
            Comentario (opcional)
          </label>
          <textarea {...register('comentario')} rows={3} className="input" />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">
            Foto o PDF de tu receta
          </label>
          <input
            type="file"
            accept="image/*,application/pdf"
            {...register('archivo')}
            className="w-full text-sm text-sol-blanco/80 file:mr-4 file:rounded-full file:border-0 file:bg-sol-amarillo file:text-sol-negro file:font-display file:font-bold file:px-4 file:py-2 file:cursor-pointer"
          />
          {errors.archivo && <p className="text-xs text-sol-rojo mt-1">{errors.archivo.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
          className="mt-2 rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-50"
        >
          {isSubmitting ? 'Enviando...' : 'Pedir presupuesto'}
        </motion.button>
      </form>
    </PageTransition>
  );
}
