import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/useCartStore';
import { useUserStore } from '../../store/useUserStore';

const LOGO_URL =
  'https://res.cloudinary.com/dabikk5ei/image/upload/v1787667390/logo_ongamj.png';

const links = [
  { to: '/', label: 'Inicio' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/catalogo?enPromocion=true', label: 'Promos' },
];

function isLinkActive(link, location) {
  const [linkPath, linkQuery] = link.to.split('?');
  if (location.pathname !== linkPath) return false;
  const enPromocion = new URLSearchParams(location.search).get('enPromocion') === 'true';
  const linkIsPromos = linkQuery?.includes('enPromocion=true');
  return linkIsPromos ? enPromocion : !enPromocion;
}

export default function Navbar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const isAdmin = useUserStore((s) => s.isAdmin());
  const isAuthenticated = useUserStore((s) => s.isAuthenticated());
  const user = useUserStore((s) => s.user);
  const location = useLocation();

  return (
    <header className="hidden md:block sticky top-0 z-40 bg-sol-negro/95 backdrop-blur border-b border-sol-blanco/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={LOGO_URL}
            alt="Óptica Sol"
            className="h-12 w-auto drop-shadow-[0_0_6px_rgba(245,197,24,0.35)]"
          />
        </Link>

        <nav className="flex items-center gap-8 font-display font-bold uppercase text-sm tracking-wide">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`transition-colors hover:text-sol-amarillo ${
                isLinkActive(link, location) ? 'text-sol-amarillo' : 'text-sol-blanco'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            to={isAdmin ? '/admin' : isAuthenticated ? '/mi-cuenta' : '/login'}
            className={`flex items-center gap-2 font-display font-bold text-sm transition-colors ${
              location.pathname.startsWith('/admin') || location.pathname === '/mi-cuenta'
                ? 'text-sol-amarillo'
                : isAdmin
                  ? 'text-sol-rojo hover:text-sol-amarillo'
                  : 'text-sol-blanco hover:text-sol-amarillo'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-5 h-5">
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
            {isAdmin ? 'Panel Admin' : isAuthenticated ? user?.nombre?.split(' ')[0] || 'Mi cuenta' : 'Ingresar'}
          </Link>

          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            <Link
              to="/carrito"
              className="relative flex items-center gap-2 rounded-full bg-sol-amarillo text-sol-negro font-display font-bold px-4 py-2 hover:brightness-95 transition"
            >
              Carrito
              {totalItems > 0 && (
                <motion.span
                  key={totalItems}
                  initial={{ scale: 1.4 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute -top-2 -right-2 bg-sol-rojo text-sol-blanco text-xs w-5 h-5 rounded-full flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
