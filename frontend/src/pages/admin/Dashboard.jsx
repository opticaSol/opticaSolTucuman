import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDashboardStats } from '../../lib/api';
import { formatPrice } from '../../lib/formatters';
import Pagination from '../../components/ui/Pagination';

const ALERTAS_POR_PAGINA = 10;

function StatCard({ label, value, accent, delay = 0, to, onClick }) {
  const content = (
    <>
      <p className="text-xs uppercase tracking-wide text-sol-blanco/50">{label}</p>
      <p className={`font-display font-black text-3xl mt-1 ${accent ? 'text-sol-rojo' : 'text-sol-amarillo'}`}>
        {value}
      </p>
    </>
  );

  const className =
    'block w-full rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5 text-left hover:border-sol-amarillo/50 transition-colors cursor-pointer';

  const Wrapper = to ? Link : 'button';
  const wrapperProps = to ? { to } : { onClick, type: 'button' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      <Wrapper {...wrapperProps} className={className}>
        {content}
      </Wrapper>
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alertasPage, setAlertasPage] = useState(1);

  useEffect(() => {
    fetchDashboardStats().then(setStats);
  }, []);

  if (!stats) {
    return <p className="text-sol-blanco/60">Cargando métricas...</p>;
  }

  function scrollToAlertas() {
    document.getElementById('stock-alertas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display font-black text-2xl uppercase">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Productos activos" value={stats.totalProductos} delay={0} to="/admin/productos" />
        <StatCard
          label="Promociones activas"
          value={stats.promocionesActivas}
          delay={0.06}
          to="/admin/promociones"
        />
        <StatCard
          label="Stock bajo"
          value={stats.stockBajo.length}
          accent={stats.stockBajo.length > 0}
          delay={0.12}
          onClick={scrollToAlertas}
        />
        <StatCard
          label="Agotados"
          value={stats.agotados.length}
          accent={stats.agotados.length > 0}
          delay={0.18}
          onClick={scrollToAlertas}
        />
      </div>

      {(stats.stockBajo.length > 0 || stats.agotados.length > 0) && (
        <motion.div
          id="stock-alertas"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.24 }}
          className="rounded-xl2 bg-sol-blanco/5 border border-sol-blanco/10 p-5 scroll-mt-6"
        >
          <h2 className="font-display font-extrabold uppercase text-sm mb-4">
            Productos con stock bajo o agotado
          </h2>
          {(() => {
            const alertas = [...stats.agotados, ...stats.stockBajo];
            const totalAlertasPages = Math.ceil(alertas.length / ALERTAS_POR_PAGINA) || 1;
            const paginaActual = Math.min(alertasPage, totalAlertasPages);
            const visibles = alertas.slice(
              (paginaActual - 1) * ALERTAS_POR_PAGINA,
              paginaActual * ALERTAS_POR_PAGINA
            );
            return (
              <>
                <div className="flex flex-col gap-2">
                  {visibles.map((p) => (
                    <Link
                      key={p._id}
                      to={`/admin/productos/${p._id}`}
                      className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-sol-blanco/5 transition-colors"
                    >
                      <span className="text-sm">{p.nombre}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-xs text-sol-blanco/50">{formatPrice(p.precio)}</span>
                        <span
                          className={`text-xs font-display font-bold px-2 py-0.5 rounded-full ${
                            p.stock === 0
                              ? 'bg-sol-negro border border-sol-rojo text-sol-rojo'
                              : 'bg-sol-rojo text-sol-blanco'
                          }`}
                        >
                          {p.stock === 0 ? 'Agotado' : `Stock: ${p.stock}`}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Pagination page={paginaActual} totalPages={totalAlertasPages} onChange={setAlertasPage} />
                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </div>
  );
}
