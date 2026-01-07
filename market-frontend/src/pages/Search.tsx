import React from 'react';
import { useSearch } from '../hooks/useSearch';
import { SearchFilters } from '../components/search/SearchFilters';
import { AnnouncementCard } from '../components/common/AnnouncementCard';

const Search: React.FC = () => {
    const { 
        results, loading, totalHits, totalPages, currentPage, 
        filters, updateFilter, setPage, search
    } = useSearch();

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-7xl min-h-screen bg-gray-50">
            <div className="mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Ogłoszenia</h1>
                    <p className="text-gray-500">Znaleziono {totalHits} ofert</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sortuj:</span>
                    <select 
                        value={filters.sortBy || 'newest'}
                        onChange={(e) => {
                            updateFilter('sortBy', e.target.value);
                        }}
                        className="border-gray-300 rounded-lg shadow-sm p-2 text-sm"
                    >
                        <option value="newest">Najnowsze</option>
                        <option value="price_asc">Cena: rosnąco</option>
                        <option value="price_desc">Cena: malejąco</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-1/4">
                    <SearchFilters 
                        filters={filters} 
                        onChange={updateFilter} 
                        onSearch={search}
                        loading={loading}
                    />
                </div>

                <div className="w-full lg:w-3/4">
                    {loading && results.length === 0 ? (
                        <div className="text-center py-12">Ładowanie...</div>
                    ) : (
                        <>
                            {results.length === 0 ? (
                                <div className="text-center py-16 bg-white rounded-xl border border-dashed">
                                    <h3 className="mt-4 font-bold text-gray-600">Brak wyników</h3>
                                    <p className="text-gray-400">Zmień kryteria wyszukiwania.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {results.map((item) => (
                                        <AnnouncementCard key={item.objectID} announcement={item} />
                                    ))}
                                </div>
                            )}

                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2 mt-12">
                                    <button
                                        disabled={currentPage === 0}
                                        onClick={() => setPage(currentPage - 1)}
                                        className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Poprzednia
                                    </button>
                                    <span className="px-4 py-2 flex items-center font-medium">
                                        {currentPage + 1} / {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage + 1 >= totalPages}
                                        onClick={() => setPage(currentPage + 1)}
                                        className="px-4 py-2 border rounded-lg bg-white disabled:opacity-50 hover:bg-gray-50"
                                    >
                                        Następna
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Search;