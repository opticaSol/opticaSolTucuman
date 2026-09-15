import { motion } from 'framer-motion';
import { CATEGORIA_LABEL, GENERO_LABEL, TIPO_LENTE_RECETADO_LABEL } from '../../lib/formatters';

function Chip({ active, onClick, children, accent }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-display font-bold border transition-colors ${
        active
          ? accent
            ? 'bg-sol-rojo border-sol-rojo text-sol-blanco'
            : 'bg-sol-amarillo border-sol-amarillo text-sol-negro'
          : 'border-sol-blanco/20 text-sol-blanco/80 hover:border-sol-amarillo'
      }`}
    >
      {children}
    </motion.button>
  );
}

const FILTER_KEYS = ['categoria', 'genero', 'tipoLenteRecetado', 'marca', 'colorArmazon', 'precioMin', 'precioMax', 'enPromocion', 'irrompible', 'q'];

export default function FiltrosChips({ filters, onToggle, onChange, onReset, filterOptions }) {
  const generos = Object.entries(GENERO_LABEL);
  const categorias = Object.entries(CATEGORIA_LABEL);
  const tiposLenteRecetado = Object.entries(TIPO_LENTE_RECETADO_LABEL);
  const hayFiltrosActivos = FILTER_KEYS.some((key) => filters[key]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {categorias.map(([value, label]) => (
          <Chip key={value} active={filters.categoria === value} onClick={() => onToggle('categoria', value)}>
            {label}
          </Chip>
        ))}
        <Chip active={filters.enPromocion} onClick={() => onChange('enPromocion', !filters.enPromocion)} accent>
          En promoción
        </Chip>
        <Chip active={filters.irrompible} onClick={() => onChange('irrompible', !filters.irrompible)}>
          Armazones para niños irrompibles
        </Chip>
        {hayFiltrosActivos && onReset && (
          <button
            onClick={onReset}
            className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-display font-bold text-sol-blanco/60 hover:text-sol-rojo transition-colors"
          >
            ✕ Limpiar filtros
          </button>
        )}
      </div>

      {['sol', 'armazones'].includes(filters.categoria) && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {generos.map(([value, label]) => (
            <Chip key={value} active={filters.genero === value} onClick={() => onToggle('genero', value)}>
              {label}
            </Chip>
          ))}
        </div>
      )}

      {filters.categoria === 'recetados' && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {tiposLenteRecetado.map(([value, label]) => (
            <Chip
              key={value}
              active={filters.tipoLenteRecetado === value}
              onClick={() => onToggle('tipoLenteRecetado', value)}
            >
              {label}
            </Chip>
          ))}
        </div>
      )}

      {filterOptions?.marcas?.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {filterOptions.marcas.map((marca) => (
            <Chip key={marca} active={filters.marca === marca} onClick={() => onToggle('marca', marca)}>
              {marca}
            </Chip>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {filterOptions?.coloresArmazon?.length > 0 && (
          <select
            value={filters.colorArmazon}
            onChange={(e) => onChange('colorArmazon', e.target.value)}
            className="rounded-full bg-sol-blanco/5 border border-sol-blanco/20 px-3 py-1.5 text-sm text-sol-blanco focus:outline-none focus:border-sol-amarillo"
          >
            <option value="">Color de armazón</option>
            {filterOptions.coloresArmazon.map((color) => (
              <option key={color} value={color}>
                {color}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
