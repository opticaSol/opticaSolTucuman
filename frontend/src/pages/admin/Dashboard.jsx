import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDashboardStats } from '../../lib/api';

function StatCard({ label, value, delay = 0, to }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link
        to={to}
        className="block w-full rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5 text-left hover:border-sol-amarillo/50 transition-colors"
      >
        <p className="text-xs uppercase tracking-wide text-sol-blanco/50">{label}</p>
        <p className="font-display font-black text-3xl mt-1 text-sol-amarillo">{value}</p>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sol-blanco/60">Cargando métricas...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display font-black text-2xl uppercase">Panel principal</h1>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Productos activos" value={stats.totalProductos} delay={0} to="/admin/productos" />
        <StatCard label="Promociones activas" value={stats.promocionesActivas} delay={0.06} to="/admin/promociones" />
      </div>
    </div>
  );
}
