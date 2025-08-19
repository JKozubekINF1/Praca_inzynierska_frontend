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
        <nav className="flex items-center space-x-4 bg-gray-100 p-4 rounded-md shadow-sm">
            <div className="group inline-block relative">
                <button className="text-blue-600 hover:text-blue-400 font-medium">Aukcje</button>
                <div className="hidden group-hover:block absolute bg-white text-gray-900 p-2 rounded shadow-md z-10 min-w-[120px]">
                    <Link to="/category/cars" className="block px-2 py-1 hover:bg-gray-100">Samochody</Link>
                    <Link to="/category/parts" className="block px-2 py-1 hover:bg-gray-100">Części</Link>
                </div>
            </div>
            {isAuthenticated ? (
                <>
                    <Link to="/add-announcement" className="text-green-600 hover:text-green-400 font-medium">
                        Dodaj ogłoszenie
                    </Link>
                    <Link to="/profile" className="text-blue-600 hover:text-blue-400 font-medium">
                        Profil
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-400 font-medium"
                    >
                        Wyloguj
                    </button>
                </>
            ) : (
                <>
                    <Link to="/login" className="text-blue-600 hover:text-blue-400 font-medium">Zaloguj</Link>
                    <Link to="/register" className="text-green-600 hover:text-green-400 font-medium">Rejestracja</Link>
                </>
            )}
        </nav>
    );
};

export default Navbar;