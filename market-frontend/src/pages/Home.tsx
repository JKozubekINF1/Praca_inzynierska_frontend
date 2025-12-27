import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { announcementService } from '../services/announcementService';
import { getImageUrl } from '../config';
import type { SearchResultItem } from '../types';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const [recentAnnouncements, setRecentAnnouncements] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchRecent = async () => {
            try {
                const data = await announcementService.search({ pageSize: 6 }); 
                setRecentAnnouncements(data.items);
            } catch (err) {
                console.error("Błąd pobierania ofert na stronę główną", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                        Znajdź swój wymarzony samochód lub część
                    </h1>
                    <p className="text-blue-100 text-lg mb-8">
                        Tysiące ogłoszeń motoryzacyjnych w jednym miejscu. Kupuj i sprzedawaj bezpiecznie.
                    </p>
                    <form onSubmit={handleSearch} className="bg-white p-2 rounded-lg shadow-xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto">
                        <input 
                            type="text" 
                            placeholder="Czego szukasz? (np. Audi A4, Alternator)" 
                            className="flex-grow p-3 text-gray-800 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            Szukaj
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
                    <Link to="/search?category=Pojazd" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center gap-6 group cursor-pointer border border-gray-100">
                        <div className="bg-blue-100 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Samochody</h3>
                            <p className="text-gray-500 text-sm">Osobowe, dostawcze i inne</p>
                        </div>
                    </Link>

                    <Link to="/search?category=Część" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 flex items-center gap-6 group cursor-pointer border border-gray-100">
                        <div className="bg-green-100 p-4 rounded-full text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Części</h3>
                            <p className="text-gray-500 text-sm">Zamienne, akcesoria, opony</p>
                        </div>
                    </Link>
                </div>
                <div className="mb-8">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Najnowsze ogłoszenia</h2>
                        <Link to="/search" className="text-blue-600 font-semibold hover:underline">
                            Zobacz wszystkie &rarr;
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                        </div>
                    ) : recentAnnouncements.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                            <p className="text-gray-500 text-lg">Brak ogłoszeń. Bądź pierwszy!</p>
                            <Link to="/add-announcement" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-md font-bold hover:bg-green-700">
                                Dodaj ogłoszenie
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recentAnnouncements.map((item) => (
                                <Link to={`/announcements/${item.id}`} key={item.id} className="group">
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                        <div className="aspect-w-16 aspect-h-10 bg-gray-200 relative h-56 overflow-hidden">
                                            <img 
                                                src={getImageUrl(item.photoUrl)} 
                                                alt={item.title} 
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Brak+zdjęcia'; 
                                                }}
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-gray-800 uppercase tracking-wide shadow-sm">
                                                {item.category}
                                            </div>
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <div className="mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {item.brand} {item.model} {item.year ? `• ${item.year}` : ''}
                                                </p>
                                            </div>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                                <span className="text-xl font-bold text-gray-900">
                                                    {item.price.toLocaleString('pl-PL')} <span className="text-sm font-normal text-gray-500">PLN</span>
                                                </span>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    {item.location || 'Polska'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚡</div>
                        <h4 className="font-bold text-gray-900 mb-2">Szybka sprzedaż</h4>
                        <p className="text-gray-500 text-sm">Wystaw ogłoszenie w 2 minuty i dotrzyj do tysięcy kupujących.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
                        <h4 className="font-bold text-gray-900 mb-2">Bezpieczeństwo</h4>
                        <p className="text-gray-500 text-sm">Weryfikujemy ogłoszenia, aby zapewnić bezpieczeństwo transakcji.</p>
                    </div>
                    <div>
                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔍</div>
                        <h4 className="font-bold text-gray-900 mb-2">Łatwe wyszukiwanie</h4>
                        <p className="text-gray-500 text-sm">Zaawansowane filtry pomogą Ci znaleźć dokładnie to, czego szukasz.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;