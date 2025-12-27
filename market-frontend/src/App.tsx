import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 
import axios, { AxiosError, type AxiosResponse } from 'axios';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AuctionDetail from './pages/AuctionDetail';
import Layout from './components/Layout';
import AddAnnouncementPage from './pages/add-announcement';
import ProfilePage from './pages/Profile';
import Search from './pages/Search';
import EditAnnouncementPage from './pages/EditAnnouncementPage';
import './App.css';

const AppContent: React.FC<{ isAuthenticated: boolean; setIsAuthenticated: (value: boolean) => void }> = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showTransition, setShowTransition] = useState<boolean>(false);
  const location = useLocation();

  const checkAuth = async () => {
    try {
      const response: AxiosResponse = await axios.get('https://localhost:7143/api/auth/verify', {
        withCredentials: true,
      });
      if (response.status === 200) setIsAuthenticated(true);
      else setIsAuthenticated(false);
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Błąd weryfikacji tokenu:', axiosError);
      setIsAuthenticated(false);
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

  return (
    <>
      {showTransition && (
        <div className="fixed top-0 left-0 w-screen h-screen bg-white flex justify-center items-center z-50">
          <h1 className="text-6xl font-bold text-blue-600">Market</h1>
        </div>
      )}
      <Layout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/auction/:id" element={<AuctionDetail />} />
          <Route path="/announcements/:id" element={<AuctionDetail />} />         
          <Route path="/add-announcement" element={<AddAnnouncementPage />} />
          <Route path="/edit-announcement/:id" element={<EditAnnouncementPage />} /> 
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Layout>
    </>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  return (
    <Router>
      <Toaster position="top-center" toastOptions={{ duration: 4000 }} />
      
      <AppContent isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
    </Router>
  );
};

export default App;