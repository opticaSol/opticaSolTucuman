import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StorefrontLayout from './components/layout/StorefrontLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import SubirReceta from './pages/SubirReceta';
import Dashboard from './pages/admin/Dashboard';
import Productos from './pages/admin/Productos';
import ProductoForm from './pages/admin/ProductoForm';
import Promociones from './pages/admin/Promociones';
import PromocionForm from './pages/admin/PromocionForm';
import HeroSlides from './pages/admin/HeroSlides';
import HeroSlideForm from './pages/admin/HeroSlideForm';
import Recetas from './pages/admin/Recetas';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import Clientes from './pages/superadmin/Clientes';
import PromoMessage from './pages/superadmin/PromoMessage';
import Envio from './pages/superadmin/Envio';

// El catálogo ahora vive dentro del Home (sección #catalogo). Esto conserva
// funcionando los links viejos a /catalogo (compartidos antes de este cambio).
function RedirectToCatalogo() {
  const location = useLocation();
  return <Navigate to={`/${location.search}#catalogo`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<RedirectToCatalogo />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
        <Route path="/subir-receta" element={<SubirReceta />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<ProductoForm />} />
        <Route path="promociones" element={<Promociones />} />
        <Route path="promociones/:id" element={<PromocionForm />} />
        <Route path="hero-slides" element={<HeroSlides />} />
        <Route path="hero-slides/:id" element={<HeroSlideForm />} />
        <Route path="recetas" element={<Recetas />} />
      </Route>

      <Route
        path="/superadmin"
        element={
          <ProtectedRoute role="superadmin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="promo" element={<PromoMessage />} />
        <Route path="envio" element={<Envio />} />
      </Route>
    </Routes>
  );
}
