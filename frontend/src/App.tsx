import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { ItemFormView } from './views/ItemFormView';
import { ItemDetailView } from './views/ItemDetailView';
import { ItemsView } from './views/ItemsView';
import { OutfitsView } from './views/OutfitsView';
import { OutfitFormView } from './views/OutfitFormView';
import { OutfitDetailView } from './views/OutfitDetailView';
import { ProfileView } from './views/ProfileView';
import { ProtectedRoute } from './components/ProtectedRoutes';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardView />} />
        
        {/* Rutas de prendas */}
        <Route path="/items" element={<ItemsView />} />
        <Route path="/items/new" element={<ItemFormView />} />
        <Route path="/items/:id" element={<ItemDetailView />} />
        <Route path="/items/:id/edit" element={<ItemFormView />} />
        
        {/* Rutas de outfits */}
        <Route path="/outfits" element={<OutfitsView />} />
        <Route path="/outfits/new" element={<OutfitFormView />} />
        <Route path="/outfits/:id" element={<OutfitDetailView />} />
        <Route path="/outfits/:id/edit" element={<OutfitFormView />} />

        {/* Perfil */}
        <Route path="/profile" element={<ProfileView />} />
      </Route>

      {/* Redirect root to dashboard (or login if not authenticated) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

