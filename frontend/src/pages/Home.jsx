import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchActivePromotions } from '../lib/api';
import HeroPromoCarousel from '../components/home/HeroPromoCarousel';
import PromosDelMes from '../components/home/PromosDelMes';
import CatalogoCompleto from '../components/home/CatalogoCompleto';
import Destacados from '../components/home/Destacados';
import Servicios from '../components/home/Servicios';
import BeneficiosRecetados from '../components/home/BeneficiosRecetados';
import PruebaSocial from '../components/home/PruebaSocial';
import MediosDePagoBanner from '../components/home/MediosDePagoBanner';
import MapaHorarios from '../components/home/MapaHorarios';
import SectionDivider from '../components/ui/SectionDivider';

export default function Home() {
  const [promotions, setPromotions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchActivePromotions().then(setPromotions).catch(() => setPromotions([]));
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (!el) return;

    // Esperar al próximo frame: el contenido de arriba (hero, promos) puede
    // seguir cargando/animando y correr la posición del elemento.
    requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }));

    // Las secciones tienen una animación de entrada (fade + slide-up) que se
    // dispara justo cuando quedan a la vista: si arranca a mitad del scroll,
    // termina de correr la posición unos px y la sección no queda alineada
    // arriba del todo. Repetimos el scroll (sin animación) cuando esa
    // animación ya terminó, para corregir el resultado final.
    const fix = setTimeout(() => {
      el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 700);

    return () => clearTimeout(fix);
  }, [location.hash, location.search]);

  return (
    <>
      <HeroPromoCarousel promotions={promotions} />
      <SectionDivider from="negro" to="amarillo" />
      <PromosDelMes promotions={promotions} />
      <SectionDivider from="amarillo" to="negro" flip />
      <Destacados />
      <CatalogoCompleto />
      <Servicios />
      <PruebaSocial />
      <SectionDivider from="negro" to="amarillo" />
      <BeneficiosRecetados />
      <SectionDivider from="amarillo" to="rojo" flip />
      <MediosDePagoBanner />
      <SectionDivider from="rojo" to="negro" flip />
      <MapaHorarios />
    </>
  );
}
