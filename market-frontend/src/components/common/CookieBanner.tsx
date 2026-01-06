import React, { useEffect, useState } from 'react';
import { initGA, logPageView } from '../../services/analytics'; 

const CookieBanner: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('market_cookie_consent');
        
        if (!consent) {
            setIsVisible(true);
        } else if (consent === 'true') {
            initGA();
            logPageView();
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('market_cookie_consent', 'true');
        setIsVisible(false);
        initGA();
        logPageView();
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-4 shadow-lg z-[100] animate-slide-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-300">
                    <p className="font-bold text-white mb-1">🍪 Szanujemy Twoją prywatność</p>
                    <p>
                        Używamy Google Analytics, aby analizować ruch na stronie. 
                        Klikając "Akceptuję", zgadzasz się na zbieranie anonimowych statystyk.
                    </p>
                </div>
                <div className="flex gap-3 shrink-0">
                    <button 
                        onClick={handleAccept}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition text-sm"
                    >
                        Akceptuję
                    </button>
                    <button 
                        onClick={() => {
                            localStorage.setItem('market_cookie_consent', 'false');
                            setIsVisible(false);
                        }}
                        className="bg-transparent border border-gray-500 hover:bg-gray-800 text-gray-300 px-6 py-2 rounded-lg font-bold transition text-sm"
                    >
                        Odrzuć
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CookieBanner;