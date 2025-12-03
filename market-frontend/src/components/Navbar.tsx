import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Upewnij się, że port i protokół (http/https) są poprawne
            const response = await fetch('https://localhost:7143/api/Auth/logout', { 
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setIsAuthenticated(false);
                navigate('/login');
            } else {
                console.error('Błąd podczas wylogowania:', await response.text());
            }
        } catch (error) {
            console.error('Błąd podczas wylogowania:', error);
        }
    };

    return (
        <nav className="flex items-center justify-between bg-white p-4 shadow-sm border-b border-gray-200">
            {/* Lewa strona - Linki nawigacyjne */}
            <div className="flex items-center space-x-6">
                {/* Logo / Home */}
                <Link to="/" className="text-xl font-bold text-blue-600 tracking-tight">
                    MarketApp
                </Link>

                {/* Dropdown Aukcje */}
                <div className="group inline-block relative">
                    <button className="text-gray-700 hover:text-blue-600 font-medium py-2 flex items-center gap-1">
                        Aukcje
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <div className="hidden group-hover:block absolute top-full left-0 bg-white text-gray-900 py-2 rounded-lg shadow-xl border border-gray-100 z-50 min-w-[150px]">
                        <Link to="/category/cars" className="block px-4 py-2 hover:bg-gray-50 transition-colors">Samochody</Link>
                        <Link to="/category/parts" className="block px-4 py-2 hover:bg-gray-50 transition-colors">Części</Link>
                    </div>
                </div>

                {/* --- NOWY LINK DO WYSZUKIWARKI --- */}
                <Link to="/search" className="text-gray-700 hover:text-blue-600 font-medium flex items-center gap-1">
                    🔍 Szukaj
                </Link>
            </div>

            {/* Prawa strona - Auth */}
            <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                    <>
                        <Link to="/add-announcement" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition font-medium text-sm">
                            + Dodaj ogłoszenie
                        </Link>
                        <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
                            Profil
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="text-red-600 hover:text-red-800 font-medium"
                        >
                            Wyloguj
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-700 hover:text-blue-600 font-medium">Zaloguj</Link>
                        <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition font-medium text-sm">Rejestracja</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;