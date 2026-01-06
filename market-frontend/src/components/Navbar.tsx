import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import type { User } from '../types';

interface NavbarProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
    user: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated, user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/auth/logout`, {}, {
                withCredentials: true
            });
            setIsAuthenticated(false);
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
            setIsAuthenticated(false);
            navigate('/login');
        }
    };

    const navLinkClass = "text-gray-700 hover:text-blue-600 font-medium transition-colors";
    const buttonPrimaryClass = "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm shadow-sm";
    const buttonGreenClass = "bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium text-sm shadow-sm flex items-center gap-1";

    return (
        <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="text-2xl font-bold text-blue-600 tracking-tight hover:text-blue-700 transition">
                            MarketApp
                        </Link>
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/search" className={`${navLinkClass} flex items-center gap-1`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                Szukaj
                            </Link>
                            <div className="group relative">
                                <button className={`${navLinkClass} flex items-center gap-1`}>
                                    Kategorie
                                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                                <div className="hidden group-hover:block absolute top-full left-0 pt-2 w-48">
                                    <div className="bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden">
                                        <Link to="/search?category=Pojazd" className="block px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition">
                                            Samochody
                                        </Link>
                                        <Link to="/search?category=Część" className="block px-4 py-3 hover:bg-blue-50 text-gray-700 hover:text-blue-700 transition">
                                            Części
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'Admin' && (
                                    <Link to="/admin" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition font-medium text-sm shadow-sm">
                                        Panel Admina
                                    </Link>
                                )}

                                <Link 
                                    to="/favorites" 
                                    className="relative p-2 text-gray-500 hover:text-red-500 transition-colors"
                                    title="Obserwowane"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </Link>

                                <Link to="/add-announcement" className={buttonGreenClass}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    <span className="hidden sm:inline">Dodaj ogłoszenie</span>
                                    <span className="sm:hidden">Dodaj</span>
                                </Link>
                                
                                <div className="h-6 w-px bg-gray-300 mx-2"></div>

                                <Link to="/profile" className={navLinkClass}>
                                    Profil
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="text-red-500 hover:text-red-700 font-medium transition-colors"
                                >
                                    Wyloguj
                                </button>
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
        </nav>
    );
};

export default Navbar;