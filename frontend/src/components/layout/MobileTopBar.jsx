import { Link } from 'react-router-dom';

const LOGO_URL =
  'https://res.cloudinary.com/dabikk5ei/image/upload/v1787667390/logo_ongamj.png';

export default function MobileTopBar() {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-sol-negro/95 backdrop-blur border-b border-sol-blanco/10 flex items-center justify-center py-2">
      <Link to="/">
        <img
          src={LOGO_URL}
          alt="Óptica Sol"
          className="h-10 w-auto drop-shadow-[0_0_6px_rgba(245,197,24,0.35)]"
        />
      </Link>
    </header>
  );
}
