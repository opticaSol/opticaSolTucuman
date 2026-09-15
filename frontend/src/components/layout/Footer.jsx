import { Link } from 'react-router-dom';

const LOGO_URL =
  'https://res.cloudinary.com/dabikk5ei/image/upload/v1787667390/logo_ongamj.png';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  'Av. 24 de Septiembre 838, San Miguel de Tucumán, T4000, TM, AR'
)}`;

export default function Footer() {
  return (
    <footer className="bg-sol-negro border-t border-sol-blanco/10 pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 text-center items-center md:text-left md:items-start md:grid-cols-3">
        <div className="flex flex-col items-center gap-4 md:items-start">
          <Link to="/">
            <img
              src={LOGO_URL}
              alt="Óptica Sol"
              className="h-16 w-auto drop-shadow-[0_0_6px_rgba(245,197,24,0.35)]"
            />
          </Link>
          <p className="text-sm text-sol-blanco/70">
            +40 años cuidando tu vista en San Miguel de Tucumán.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-display font-extrabold text-sol-amarillo uppercase mb-3">
            Ubicación y horarios
          </h3>
          <a
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-sol-blanco/80 hover:text-sol-amarillo transition-colors underline decoration-sol-blanco/30 underline-offset-2"
          >
            24 de Septiembre 838, San Miguel de Tucumán
          </a>
          <p className="text-sm text-sol-blanco/80 mt-2">Lunes a Viernes: 8 a 13 y 17 a 20:30 hs</p>
          <p className="text-sm text-sol-blanco/80">Sábados: 9 a 12 hs</p>
        </div>

        <div className="flex flex-col items-center md:items-start">
          <h3 className="font-display font-extrabold text-sol-amarillo uppercase mb-3">
            Contacto
          </h3>
          <a
            href="https://wa.link/s1krfl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-display font-bold bg-sol-rojo text-sol-blanco px-4 py-2 rounded-full hover:brightness-95 transition"
          >
            Escribinos por WhatsApp
          </a>
        </div>
      </div>

      <div className="border-t border-sol-blanco/10 py-4 px-6 pr-20 md:pr-6 text-center text-xs text-sol-blanco/50">
        © {new Date().getFullYear()} Óptica Sol. Todos los derechos reservados.
      </div>
    </footer>
  );
}
