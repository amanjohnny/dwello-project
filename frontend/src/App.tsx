import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { PageLoader } from './components/PageLoader';
import { 
  LoginPage, 
  RegisterPage, 
  HomePage, 
  SearchPage,
  ListingDetailsPage, 
  CreateListingPage,
  MatchesPage,
  ProfilePage,
  PublicProfilePage,
  ChatPage
} from './pages';
import { useAuthStore } from './store';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }
  
  return <>{children}</>;
};

// Auth Route Component (redirect to home if already authenticated)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App content with loading on route change
const AppContent = () => {
  const location = useLocation();
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isPageLoading && <PageLoader />}
      <Routes>
        {/* Auth Routes - Registration is first (default) */}
        <Route 
          path="/register" 
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          } 
        />
        
        {/* Main App Routes */}
        <Route element={<MainLayout />}>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/listing/:id" element={<ListingDetailsPage />} />
          <Route 
            path="/create-listing" 
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/matches" 
            element={
              <ProtectedRoute>
                <MatchesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <PublicProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:userId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
        </Route>
        
        {/* Catch all - redirect to register (first page) */}
        <Route path="*" element={<Navigate to="/register" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
