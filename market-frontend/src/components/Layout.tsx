import React from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated, setIsAuthenticated }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="bg-white text-gray-900 p-4 flex justify-between items-center shadow-md">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-400">Market Auto</Link>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      </header>
      <main className="flex-1 overflow-y-auto">{children}</main>
      <footer className="bg-gray-800 p-4 text-center w-full">
        <p>© 2025 Market Auto. Wszelkie prawa zastrzeżone.</p>
        <div className="flex justify-center gap-4 mt-2">
          <a href="#" className="text-blue-400 hover:text-blue-300">O nas</a>
          <a href="#" className="text-blue-400 hover:text-blue-300">Regulamin</a>
          <a href="#" className="text-blue-400 hover:text-blue-300">Kontakt</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;