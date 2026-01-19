import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { User } from '../types';
import { transactionService } from '../services/transactionservice';
import { chatService } from '../services/chatService';
import TopUpModal from './common/TopUpModal';

interface NavbarProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [balance, setBalance] = useState<number | null>(null);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    let unsubscribeChat: (() => void) | undefined;

    const initData = async () => {
      if (isAuthenticated) {
        try {
          const bal = await transactionService.getBalance();
          setBalance(bal);

          if (user && user.id) {
            unsubscribeChat = chatService.subscribeToTotalUnreadCount(user.id, (count) => {
              setUnreadMessages(count);
            });
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    initData();
    setIsMobileMenuOpen(false);

    return () => {
      if (unsubscribeChat) unsubscribeChat();
    };
  }, [isAuthenticated, location.pathname, user]);

  const handleLogout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setBalance(null);
      setUnreadMessages(0);
      navigate('/login');
    } catch (error) {
      setIsAuthenticated(false);
      navigate('/login');
    }
  };

  const navLinkClass =
    'text-gray-700 hover:text-blue-600 font-medium transition-colors block py-2 md:py-0';
  const buttonPrimaryClass =
    'bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm shadow-sm w-full md:w-auto text-center block';
  const buttonGreenClass =
    'bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium text-sm shadow-sm flex items-center justify-center gap-1 w-full md:w-auto';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link
                to="/"
                className="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition"
              >
                Market
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link to="/search" className={`${navLinkClass} flex items-center gap-1`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                  Szukaj
                </Link>

                <div className="group relative">
                  <button className={`${navLinkClass} flex items-center gap-1`}>
                    Kategorie
                    <svg
                      className="w-4 h-4 transition-transform group-hover:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      ></path>
                    </svg>
                  </button>
                  <div className="hidden group-hover:block absolute top-full left-0 pt-2 w-48 animate-fade-in">
                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                      <Link
                        to="/search?category=Pojazd"
                        className="block px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition"
                      >
                        Samochody
                      </Link>
                      <Link
                        to="/search?category=Część"
                        className="block px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition"
                      >
                        Części
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
              <div className="hidden md:flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    {balance !== null && (
                      <div
                        onClick={() => setIsTopUpOpen(true)}
                        className="hidden lg:flex flex-col items-end mr-2 px-3 py-1 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition group relative"
                        title="Kliknij, aby doładować"
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider group-hover:text-blue-600">
                            Portfel
                          </span>
                          <span className="bg-blue-100 text-blue-600 rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                            +
                          </span>
                        </div>
                        <span
                          className={`text-sm font-bold ${balance > 0 ? 'text-green-600' : 'text-gray-800'}`}
                        >
                          {balance.toFixed(2)} PLN
                        </span>
                      </div>
                    )}
                    {user?.role === 'Admin' && (
                      <Link
                        to="/admin"
                        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition font-medium text-sm shadow-sm"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      to="/messages"
                      className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                        />
                      </svg>
                      {unreadMessages > 0 && (
                        <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-sm animate-pulse">
                          {unreadMessages > 9 ? '9+' : unreadMessages}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/favorites"
                      className="relative p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>
                    </Link>
                    <Link
                      to="/orders"
                      className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                        />
                      </svg>
                    </Link>
                    <Link to="/add-announcement" className={buttonGreenClass}>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                      <span>Dodaj</span>
                    </Link>

                    <div className="h-6 w-px bg-gray-300 mx-2"></div>
                    <div className="flex flex-col items-end">
                      <Link
                        to="/profile"
                        className="text-sm font-medium text-gray-700 hover:text-blue-600"
                      >
                        {user?.username}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                      >
                        Wyloguj
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/login" className={navLinkClass}>
                      Zaloguj
                    </Link>
                    <Link to="/register" className={buttonPrimaryClass}>
                      Rejestracja
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4 space-y-3 animate-fade-in">
              <Link to="/search" className={navLinkClass}>
                Wyszukiwarka
              </Link>
              <div className="pl-4 border-l-2 border-gray-100 space-y-2">
                <Link to="/search?category=Pojazd" className="block text-sm text-gray-600">
                  Samochody
                </Link>
                <Link to="/search?category=Część" className="block text-sm text-gray-600">
                  Części
                </Link>
              </div>

              {isAuthenticated ? (
                <>
                  <div className="border-t border-gray-100 my-2"></div>

                  {balance !== null && (
                    <div
                      onClick={() => setIsTopUpOpen(true)}
                      className="flex items-center justify-between px-2 py-2 bg-blue-50 rounded cursor-pointer"
                    >
                      <span className="text-sm font-bold text-blue-700">Portfel</span>
                      <span className="font-bold text-blue-800">{balance.toFixed(2)} PLN</span>
                    </div>
                  )}

                  <Link
                    to="/messages"
                    className={`${navLinkClass} flex justify-between items-center`}
                  >
                    Wiadomości
                    {unreadMessages > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                  <Link to="/favorites" className={navLinkClass}>
                    Ulubione
                  </Link>
                  <Link to="/orders" className={navLinkClass}>
                    Moje zamówienia
                  </Link>

                  {user?.role === 'Admin' && (
                    <Link to="/admin" className="text-purple-600 font-bold block py-2">
                      Panel Admina
                    </Link>
                  )}

                  <Link to="/add-announcement" className={`${buttonGreenClass} mt-2`}>
                    Dodaj ogłoszenie
                  </Link>

                  <div className="border-t border-gray-100 my-2 pt-2 flex justify-between items-center">
                    <Link to="/profile" className="font-bold text-gray-800">
                      {user?.username}
                    </Link>
                    <button onClick={handleLogout} className="text-red-500 font-medium text-sm">
                      Wyloguj
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-100 my-2"></div>
                  <Link
                    to="/login"
                    className="block py-2 text-center border border-gray-300 rounded text-gray-700"
                  >
                    Zaloguj
                  </Link>
                  <Link
                    to="/register"
                    className="block py-2 text-center bg-blue-600 text-white rounded mt-2"
                  >
                    Rejestracja
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onSuccess={() => {
          transactionService.getBalance().then(setBalance);
        }}
      />
    </>
  );
};

export default Navbar;
