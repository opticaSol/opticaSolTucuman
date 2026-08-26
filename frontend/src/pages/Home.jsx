import { useEffect, useState } from 'react';
import { fetchActivePromotions, fetchProducts } from '../lib/api';
import HeroPromoCarousel from '../components/home/HeroPromoCarousel';
import PromosDelMes from '../components/home/PromosDelMes';
import DestacadosPorCategoria from '../components/home/DestacadosPorCategoria';
import PruebaSocial from '../components/home/PruebaSocial';
import MediosDePagoBanner from '../components/home/MediosDePagoBanner';
import MapaHorarios from '../components/home/MapaHorarios';
import SectionDivider from '../components/ui/SectionDivider';

export default function Home() {
  const [promotions, setPromotions] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    fetchActivePromotions().then(setPromotions).catch(() => setPromotions([]));

    Promise.all(
      ['sol', 'contacto', 'recetados'].map((categoria) =>
        fetchProducts({ categoria, limit: 8 }).then((data) => [categoria, data.items])
      )
    ).then((entries) => setProductsByCategory(Object.fromEntries(entries)));
  }, []);

  return (
    <>
      <HeroPromoCarousel promotions={promotions} />
      <SectionDivider from="negro" to="amarillo" />
      <PromosDelMes promotions={promotions} />
      <SectionDivider from="amarillo" to="negro" flip />
      <DestacadosPorCategoria productsByCategory={productsByCategory} />
      <PruebaSocial />
      <SectionDivider from="negro" to="rojo" />
      <MediosDePagoBanner />
      <SectionDivider from="rojo" to="negro" flip />
      <MapaHorarios />
    </>
  );
}
