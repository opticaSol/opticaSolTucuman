import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';
import { NAV_LINKS, isLinkActive } from './Navbar';

const icons = {
  home: (
    <path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
  ),
  carrito: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6" />
    </>
  ),
  cuenta: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  catalogo: (
    <>
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </>
  ),
  beneficios: <path d="M12 3l2.6 5.8 6.4.6-4.8 4.2 1.4 6.2L12 16.9 6.4 19.8l1.4-6.2L3 9.4l6.4-.6L12 3Z" />,
};

function TabIcon({ name, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
    >
      {icons[name]}
    </svg>
  );
}

const tabs = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { hash: 'catalogo', label: 'Catálogo', icon: 'catalogo' },
  { to: '/carrito', label: 'Carrito', icon: 'carrito', badge: true },
  { hash: 'beneficios', label: 'Beneficios', icon: 'beneficios' },
  { to: '/mi-cuenta', label: 'Mi cuenta', icon: 'cuenta' },
];

const DRAWER_HASHES_EN_BOTTOM_BAR = tabs.filter((t) => t.hash).map((t) => t.hash);

function isTabActive(tab, location) {
  if (tab.hash) return isLinkActive(tab, location);
  if (tab.label === 'Inicio') {
    return location.pathname === '/' && !location.hash;
  }
  return location.pathname === tab.to;
}

export default function BottomTabBar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const isAdmin = useUserStore((s) => s.isAdmin());
  const isAuthenticated = useUserStore((s) => s.isAuthenticated());
  const user = useUserStore((s) => s.user);
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ y: menuOpen ? 0 : '100%' }}
        transition={{ duration: 0.25 }}
        className="fixed inset-x-0 bottom-16 z-40 max-h-[70vh] overflow-y-auto bg-sol-negro border-t border-sol-blanco/10 rounded-t-2xl p-6 flex flex-col gap-1 md:hidden"
      >
        <div className="flex items-center justify-between mb-2">
          <p className="font-display font-black uppercase text-sol-amarillo">Menú</p>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
            className="p-2 -m-2 text-sol-blanco"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {NAV_LINKS.filter((link) => !DRAWER_HASHES_EN_BOTTOM_BAR.includes(link.hash)).map((link) => (
          <Link
            key={link.hash}
            to={`/#${link.hash}`}
            className={`rounded-lg px-3 py-2.5 font-display font-bold uppercase text-sm transition-colors ${
              isLinkActive(link, location)
                ? 'text-sol-amarillo bg-sol-amarillo/10'
                : 'text-sol-blanco hover:bg-sol-blanco/5'
            }`}
          >
            {link.label}
          </Link>
        ))}

        <div className="border-t border-sol-blanco/10 mt-3 pt-3">
          <Link
            to={isAdmin ? '/admin' : isAuthenticated ? '/mi-cuenta' : '/login'}
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-display font-bold text-sm text-sol-blanco hover:bg-sol-blanco/5"
          >
            <TabIcon name="cuenta" className="w-5 h-5" />
            {isAdmin ? 'Panel Admin' : isAuthenticated ? user?.nombre?.split(' ')[0] || 'Mi cuenta' : 'Ingresar'}
          </Link>
        </div>
      </motion.aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sol-negro border-t border-sol-blanco/10 pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-6">
          {tabs.map((tab) => {
            const isActive = isTabActive(tab, location);
            return (
              <Link
                key={tab.label}
                to={tab.hash ? `/#${tab.hash}` : tab.to}
                className={`relative flex flex-col items-center justify-center gap-1 py-2.5 px-0.5 text-[9.5px] leading-tight text-center font-display font-bold ${
                  isActive ? 'text-sol-amarillo' : 'text-sol-blanco/70'
                }`}
              >
                <TabIcon name={tab.icon} className="w-5 h-5" />
                {tab.label}
                {tab.badge && totalItems > 0 && (
                  <span className="absolute top-1 right-[18%] bg-sol-rojo text-sol-blanco text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            );
          })}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className={`relative flex flex-col items-center justify-center gap-1 py-2.5 px-0.5 text-[9.5px] leading-tight text-center font-display font-bold ${
              menuOpen ? 'text-sol-amarillo' : 'text-sol-blanco/70'
            }`}
          >
            <TabIcon name="menu" className="w-5 h-5" />
            Menú
          </button>
        </div>
      </nav>
    </>
  );
}
