import { Link, useLocation } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';

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
  { to: '/carrito', label: 'Carrito', icon: 'carrito', badge: true },
  { to: '/mi-cuenta', label: 'Mi cuenta', icon: 'cuenta' },
];

function isTabActive(tab, location) {
  if (tab.label === 'Inicio') {
    return location.pathname === '/' && !location.hash;
  }
  return location.pathname === tab.to;
}

export default function BottomTabBar() {
  const totalItems = useCartStore((s) => s.totalItems());
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sol-negro border-t border-sol-blanco/10 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-3">
        {tabs.map((tab) => {
          const isActive = isTabActive(tab, location);
          return (
            <Link
              key={tab.label}
              to={tab.to}
              className={`relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-display font-bold ${
                isActive
                  ? tab.accent
                    ? 'text-sol-rojo'
                    : 'text-sol-amarillo'
                  : 'text-sol-blanco/70'
              }`}
            >
              <TabIcon name={tab.icon} className="w-5 h-5" />
              {tab.label}
              {tab.badge && totalItems > 0 && (
                <span className="absolute top-1 right-[22%] bg-sol-rojo text-sol-blanco text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
