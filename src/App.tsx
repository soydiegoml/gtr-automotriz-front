import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import PublicLayout from './components/layout/PublicLayout';
import CatalogPage from './pages/CatalogPage'; // La página de gestión de inventario
import PublicCatalogPage from './pages/PublicCatalogPage'; // La nueva página pública
import { Typography } from '@mui/material';

// Componente de marcador de posición para la página de inicio del admin
const AdminHomePage = () => <Typography variant="h4">Resumen del Negocio (Dashboard)</Typography>;

function App() {
  return (
    <Routes>
      {/* --- SECCIÓN PÚBLICA (TEMA OSCURO) --- */}
      {/* Todas las rutas dentro de este grupo usarán el PublicLayout */}
      <Route path="/" element={<PublicLayout />}>
        {/* La ruta principal ahora muestra nuestro nuevo catálogo público */}
        <Route index element={<PublicCatalogPage />} />
        
        {/* En el futuro, la página de detalle iría aquí: */}
        {/* <Route path="vehiculo/:id" element={<VehicleDetailPage />} /> */}
      </Route>

      {/* --- SECCIÓN DE ADMINISTRACIÓN (TEMA CLARO) --- */}
      {/* Todas las rutas que empiecen con /admin usarán el DashboardLayout */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route path="dashboard" element={<AdminHomePage />} />
        <Route path="inventario" element={<CatalogPage />} />
        
        {/* Esta línea es importante: si alguien va a "/admin", lo redirige a "/admin/dashboard" */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
