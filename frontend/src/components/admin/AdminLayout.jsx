import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserStore } from '../../store/useUserStore';
import { confirmLogout } from '../../lib/confirmLogout';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/productos', label: 'Productos' },
  { to: '/admin/promociones', label: 'Promociones' },
  { to: '/admin/pedidos', label: 'Pedidos' },
  { to: '/admin/recetas', label: 'Recetas' },
];

export default function AdminLayout() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleLogout() {
    if (await confirmLogout()) {
      logout();
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-sol-negro text-sol-blanco flex">
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="w-56 shrink-0 border-r border-sol-blanco/10 p-6 flex flex-col gap-6"
      >
        <div>
          <p className="font-display font-black uppercase text-sol-amarillo">Panel Admin</p>
          <p className="text-xs text-sol-blanco/50 mt-1">{user?.email}</p>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `relative isolate rounded-full px-4 py-2 text-sm font-display font-bold transition-colors ${
                  isActive ? 'text-sol-negro' : 'text-sol-blanco/70 hover:bg-sol-blanco/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="admin-nav-active"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-sol-amarillo -z-10"
                    />
                  )}
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <NavLink to="/mi-cuenta" className="text-xs text-sol-blanco/50 hover:text-sol-amarillo">
            Mi perfil
          </NavLink>
          <NavLink to="/" className="text-xs text-sol-blanco/50 hover:text-sol-amarillo">
            ← Volver al sitio
          </NavLink>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="text-left text-xs font-display font-bold text-sol-rojo hover:underline"
          >
            Cerrar sesión
          </motion.button>
        </div>
      </motion.aside>

      <main className="flex-1 p-8 overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
