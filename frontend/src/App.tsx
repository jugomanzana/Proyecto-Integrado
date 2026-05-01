import { Routes, Route, Navigate } from 'react-router-dom';
import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { ProtectedRoute } from './components/ProtectedRoutes';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardView />} />
      </Route>

      {/* Redirect root to dashboard (or login if not authenticated) */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
