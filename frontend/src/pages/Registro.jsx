import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { registerSchema } from '../schemas/authSchemas';
import { registerUser } from '../lib/api';
import { useUserStore } from '../store/useUserStore';
import PasswordInput from '../components/ui/PasswordInput';
import AuthLayout from '../components/auth/AuthLayout';

export default function Registro() {
  const navigate = useNavigate();
  const setSession = useUserStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values) {
    try {
      const data = await registerUser(values);
      setSession(data);
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido/a, ${data.user.nombre}!`,
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#F5C518',
        timer: 1800,
        showConfirmButton: false,
      });
      navigate('/mi-cuenta', { replace: true });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos crear tu cuenta',
        text: err.response?.data?.message || 'Intentá de nuevo en unos minutos',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display font-black text-2xl uppercase mb-1">Crear cuenta</h1>
      <p className="text-sm text-sol-blanco/50 mb-8">Es rápido y te va a servir para tus compras.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <input
            type="text"
            placeholder="Nombre completo"
            {...register('nombre')}
            className="w-full rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
          />
          {errors.nombre && <p className="text-xs text-sol-rojo mt-1 px-2">{errors.nombre.message}</p>}
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register('email')}
            className="w-full rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
          />
          {errors.email && <p className="text-xs text-sol-rojo mt-1 px-2">{errors.email.message}</p>}
        </div>

        <div>
          <PasswordInput
            placeholder="Contraseña"
            {...register('password')}
            className="w-full rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
          />
          {errors.password && (
            <p className="text-xs text-sol-rojo mt-1 px-2">{errors.password.message}</p>
          )}
        </div>

        <div>
          <PasswordInput
            placeholder="Confirmar contraseña"
            {...register('confirmPassword')}
            className="w-full rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-4 py-2.5 text-sm focus:outline-none focus:border-sol-amarillo transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-sol-rojo mt-1 px-2">{errors.confirmPassword.message}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-50 shadow-card"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-sol-blanco/60 mt-6">
        ¿Ya tenés cuenta?{' '}
        <Link to="/login" className="text-sol-amarillo font-bold hover:underline">
          Iniciá sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
