import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { promoMessageSchema } from '../../schemas/promoMessageSchema';
import { fetchPromoMessage, updatePromoMessage } from '../../lib/api';
import { fillPromoTemplate } from '../../lib/whatsapp';

export default function PromoMessage() {
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(promoMessageSchema), defaultValues: { texto: '' } });

  const texto = watch('texto');

  useEffect(() => {
    fetchPromoMessage().then((data) => {
      reset({ texto: data.texto });
      setLoading(false);
    });
  }, [reset]);

  async function onSubmit(values) {
    try {
      await updatePromoMessage(values);
      Swal.fire({
        icon: 'success',
        title: 'Mensaje guardado',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar',
        text: err.response?.data?.message,
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  if (loading) return <p className="text-sol-blanco/60">Cargando...</p>;

  return (
    <div className="max-w-xl flex flex-col gap-8">
      <h1 className="font-display font-black text-2xl uppercase">Mensaje de promo</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <label className="text-xs uppercase tracking-wide text-sol-blanco/50 block mb-1">
            Mensaje (usá <code>{'{nombre}'}</code> donde va el nombre del cliente)
          </label>
          <textarea {...register('texto')} rows={6} className="input w-full" />
          {errors.texto && <p className="text-xs text-sol-rojo mt-1">{errors.texto.message}</p>}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-50"
        >
          {isSubmitting ? 'Guardando...' : 'Guardar mensaje'}
        </motion.button>
      </form>

      <div>
        <p className="text-xs uppercase tracking-wide text-sol-blanco/50 mb-2">Vista previa</p>
        <div className="flex justify-end">
          <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#005c4b] text-sol-blanco px-4 py-3 text-sm whitespace-pre-wrap">
            {fillPromoTemplate(texto, 'Juan')}
          </div>
        </div>
      </div>
    </div>
  );
}
