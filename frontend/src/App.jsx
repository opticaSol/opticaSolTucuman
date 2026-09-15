import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StorefrontLayout from './components/layout/StorefrontLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import Home from './pages/Home';
import ProductoDetalle from './pages/ProductoDetalle';
import Carrito from './pages/Carrito';
import MiCuenta from './pages/MiCuenta';
import Login from './pages/Login';
import Registro from './pages/Registro';
import CheckoutResultado from './pages/CheckoutResultado';
import SubirReceta from './pages/SubirReceta';
import Dashboard from './pages/admin/Dashboard';
import Productos from './pages/admin/Productos';
import ProductoForm from './pages/admin/ProductoForm';
import Promociones from './pages/admin/Promociones';
import PromocionForm from './pages/admin/PromocionForm';
import Pedidos from './pages/admin/Pedidos';
import Recetas from './pages/admin/Recetas';

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
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} />
        <Route path="/subir-receta" element={<SubirReceta />} />
        <Route path="/registro" element={<Registro />} />
        <Route
          path="/mi-cuenta"
          element={
            <ProtectedRoute>
              <MiCuenta />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout/resultado"
          element={
            <ProtectedRoute>
              <CheckoutResultado />
            </ProtectedRoute>
          }
        />
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
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="recetas" element={<Recetas />} />
      </Route>
    </Routes>
  );
}
