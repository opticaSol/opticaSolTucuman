import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';
import { loginSchema } from '../schemas/authSchemas';
import { loginUser } from '../lib/api';
import { useUserStore } from '../store/useUserStore';
import PasswordInput from '../components/ui/PasswordInput';
import AuthLayout from '../components/auth/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useUserStore((s) => s.setSession);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values) {
    try {
      const data = await loginUser(values);
      setSession(data);
      const destino = data.user?.rol === 'admin' ? '/admin' : location.state?.from || '/mi-cuenta';
      navigate(destino, { replace: true });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'No pudimos iniciar sesión',
        text: err.response?.data?.message || 'Revisá tus datos e intentá de nuevo',
        background: '#0D0D0D',
        color: '#FFFFFF',
        confirmButtonColor: '#D32027',
      });
    }
  }

  return (
    <AuthLayout>
      <h1 className="font-display font-black text-2xl uppercase mb-1">Iniciar sesión</h1>
      <p className="text-sm text-sol-blanco/50 mb-8">Entrá para ver tus pedidos y tu perfil.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full bg-sol-amarillo text-sol-negro font-display font-bold py-3 disabled:opacity-50 shadow-card"
        >
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </motion.button>
      </form>

      <p className="text-center text-sm text-sol-blanco/60 mt-6">
        ¿No tenés cuenta?{' '}
        <Link to="/registro" className="text-sol-amarillo font-bold hover:underline">
          Registrate
        </Link>
      </p>
    </AuthLayout>
  );
}
