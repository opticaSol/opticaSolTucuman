import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchSuperAdminDashboard } from '../../lib/api';

function StatCard({ label, value, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5"
    >
      <p className="text-xs uppercase tracking-wide text-sol-blanco/50">{label}</p>
      <p className="font-display font-black text-3xl mt-1 text-sol-amarillo">{value}</p>
    </motion.div>
  );
}

function AccesoRapido({ to, label }) {
  return (
    <Link
      to={to}
      className="rounded-xl2 bg-sol-rojo text-sol-blanco font-display font-bold text-center py-5 px-4 hover:brightness-95 transition"
    >
      {label}
    </Link>
  );
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchSuperAdminDashboard().then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sol-blanco/60">Cargando métricas...</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display font-black text-2xl uppercase">Panel del dueño</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total de clientes" value={stats.totalClientes} delay={0} />
        <StatCard label="Aceptan promos" value={stats.clientesAceptanPromos} delay={0.06} />
        <StatCard label="Contactados este mes" value={stats.contactadosEsteMes} delay={0.12} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AccesoRapido to="/superadmin/clientes" label="Cargar cliente" />
        <AccesoRapido to="/superadmin/promo" label="Editar promo" />
        <AccesoRapido to="/superadmin/envio" label="Enviar promo" />
      </div>
    </div>
  );
}
