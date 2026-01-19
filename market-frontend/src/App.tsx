import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import AddAnnouncementPage from './pages/add-announcement';
import EditAnnouncementPage from './pages/EditAnnouncementPage';
import ProfilePage from './pages/Profile';
import Search from './pages/Search';
import AdminPanel from './pages/AdminPanel';
import UserProfilePage from './pages/UserProfilePage';
import FavoritesPage from './pages/FavoritesPage';
import Messages from './pages/Messages';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CookieBanner from './components/common/CookieBanner';
import OrdersPage from './pages/OrdersPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { logPageView } from './services/analytics';
import './App.css';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading)
    return <div className="flex justify-center items-center h-screen">Weryfikacja...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/" replace />;

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const [showTransition, setShowTransition] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    const consent = localStorage.getItem('market_cookie_consent');
    if (consent === 'true') {
      logPageView();
    }
  }, [location]);

  useEffect(() => {
    setShowTransition(true);
    const timer = setTimeout(() => setShowTransition(false), 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Ładowanie aplikacji...</div>;
  }

  return (
    <>
      {showTransition && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white flex justify-center items-center z-50 pointer-events-none transition-opacity duration-300">
          <h1 className="text-6xl font-bold text-blue-600 animate-pulse">Market</h1>
        </div>
      )}

      <Layout isAuthenticated={!!user} setIsAuthenticated={logout} user={user}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/search" element={<Search />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/announcements/:id" element={<AuctionDetail />} />
          <Route path="/users/:id" element={<UserProfilePage />} />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-announcement"
            element={
              <ProtectedRoute>
                <AddAnnouncementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-announcement/:id"
            element={
              <ProtectedRoute>
                <EditAnnouncementPage />
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
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
        </Routes>
      </Layout>

      <CookieBanner />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Router>
          <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
          <AppRoutes />
        </Router>
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;
