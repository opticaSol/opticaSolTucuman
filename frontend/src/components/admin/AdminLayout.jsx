import { useEffect, useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  async function handleLogout() {
    if (await confirmLogout()) {
      logout();
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-sol-negro text-sol-blanco md:flex">
      <header className="flex items-center justify-between p-4 border-b border-sol-blanco/10 md:hidden">
        <p className="font-display font-black uppercase text-sol-amarillo">Panel Admin</p>
        <button
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
          className="p-2 -m-2 text-sol-blanco"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
            <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sol-negro border-r border-sol-blanco/10 p-6 flex flex-col gap-6 transition-transform duration-300 md:static md:z-auto md:w-56 md:shrink-0 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-black uppercase text-sol-amarillo">Panel Admin</p>
            <p className="text-xs text-sol-blanco/50 mt-1">{user?.email}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
            className="p-2 -m-2 text-sol-blanco md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
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
      </aside>

      <main className="flex-1 min-w-0 p-4 md:p-8 overflow-x-auto">
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
