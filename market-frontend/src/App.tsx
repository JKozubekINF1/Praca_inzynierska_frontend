import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axios, { AxiosError } from 'axios';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import AddAnnouncementPage from './pages/add-announcement';
import EditAnnouncementPage from './pages/EditAnnouncementPage';
import ProfilePage from './pages/Profile';
import Search from './pages/Search';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';
import UserProfilePage from './pages/UserProfilePage';
import { API_BASE_URL } from './config';
import type { User } from './types';
import './App.css';

const AdminRoute = ({ user, children }: { user: User | null, children: React.ReactNode }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (user.role !== 'Admin') {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppContent: React.FC<{ 
  user: User | null; 
  setUser: React.Dispatch<React.SetStateAction<User | null>>; 
}> = ({ user, setUser }) => {
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTransition, setShowTransition] = useState<boolean>(false);
  const location = useLocation();

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
        withCredentials: true,
      });

      if (response.status === 200 && response.data.user) {
        setUser({
          username: response.data.user.username,
          role: response.data.user.role
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Błąd weryfikacji tokenu:', axiosError);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    setShowTransition(true);
    const timer = setTimeout(() => setShowTransition(false), 1500);
    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Ładowanie...</div>;

  const isAuthenticated = !!user;

  return (
    <>
      {showTransition && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white flex justify-center items-center z-50">
          <h1 className="text-6xl font-bold text-blue-600">Market</h1>
        </div>
      )}
      
      <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={() => setUser(null)} user={user}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/announcements/:id" element={<AuctionDetail />} />        
          <Route path="/add-announcement" element={<AddAnnouncementPage />} />
          <Route path="/edit-announcement/:id" element={<EditAnnouncementPage />} /> 
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/users/:id" element={<UserProfilePage />} />
          <Route 
            path="/admin" 
            element={
              <AdminRoute user={user}>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Routes>
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      <AppContent user={user} setUser={setUser} />
    </Router>
  );
};

export default App;