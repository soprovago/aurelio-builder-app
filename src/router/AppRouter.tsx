import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthState } from '@/store';

// Importar módulos (las crearemos después)
import LoginModule from '@/modules/auth/LoginModule';
import DashboardModule from '@/modules/dashboard/DashboardModule';
import EditorModule from '@/modules/editor/EditorModule';

// Componente para proteger rutas que requieren autenticación
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthState();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Componente para redirigir usuarios autenticados lejos del login
const PublicRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthState();
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta por defecto - redirigir basado en autenticación */}
        <Route 
          path="/" 
          element={
            <Navigate to="/dashboard" replace />
          } 
        />
        
        {/* Rutas públicas (solo accesibles cuando no está autenticado) */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <LoginModule />
            </PublicRoute>
          } 
        />
        
        {/* Rutas protegidas (requieren autenticación) */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardModule />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/editor" 
          element={
            <ProtectedRoute>
              <EditorModule />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/editor/:projectId" 
          element={
            <ProtectedRoute>
              <EditorModule />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta 404 - Página no encontrada */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Página no encontrada
                </h2>
                <p className="text-gray-600 mb-8">
                  La página que buscas no existe o ha sido movida.
                </p>
                <Navigate to="/dashboard" replace />
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;