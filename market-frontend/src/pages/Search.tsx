import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchFilters } from '../components/search/SearchFilters';
import { AnnouncementCard } from '../components/common/AnnouncementCard';

const Search: React.FC = () => {
    const { 
        results, loading, hasSearched, search,
        ...filters 
    } = useSearch();

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl min-h-screen bg-gray-50">
            <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                    Znajdź to, czego szukasz
                </h1>
                <p className="text-gray-500">
                    Przeszukuj setki ofert motoryzacyjnych.
                </p>
            </div>
            <SearchFilters 
                {...filters} 
                onSearch={search} 
                loading={loading} 
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((item) => (
                    <AnnouncementCard 
                        key={item.objectID} 
                        announcement={item} 
                    />
                ))}
            </div>
            {hasSearched && results.length === 0 && !loading && (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300 mt-8">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Brak wyników</h3>
                    <p className="text-gray-500">
                        Nie znaleźliśmy ogłoszeń spełniających Twoje kryteria.
                    </p>
                </div>
            )}
            {loading && results.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-blue-600 font-bold">Ładowanie wyników...</p>
                </div>
            )}
        </div>
    );
};

export default Search;