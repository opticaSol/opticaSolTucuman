import { useEffect, useState } from 'react';

function getRemaining(endDate) {
  const total = new Date(endDate).getTime() - Date.now();
  if (total <= 0) return null;
  return {
    total,
    dias: Math.floor(total / (1000 * 60 * 60 * 24)),
    horas: Math.floor((total / (1000 * 60 * 60)) % 24),
    minutos: Math.floor((total / (1000 * 60)) % 60),
    segundos: Math.floor((total / 1000) % 60),
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function CountdownTimer({ endDate }) {
  const [remaining, setRemaining] = useState(() => getRemaining(endDate));

  useEffect(() => {
    if (!endDate) return;
    const interval = setInterval(() => {
      setRemaining(getRemaining(endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [endDate]);

  if (!endDate || !remaining) return null;

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-sol-negro/70 px-3 py-1.5 font-display text-sm font-bold text-sol-amarillo">
      <span>Termina en</span>
      {remaining.dias > 0 && <span>{remaining.dias}d</span>}
      <span>
        {pad(remaining.horas)}:{pad(remaining.minutos)}:{pad(remaining.segundos)}
      </span>
    </div>
  );
}
