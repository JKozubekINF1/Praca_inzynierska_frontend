import React, { useState } from 'react';
import axios from 'axios';
import type { SearchResponse, SearchResultItem } from '../types';


const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [minYear, setMinYear] = useState<string>('');


  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); 

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const response = await axios.get<SearchResponse>('https://localhost:7143/api/announcements/search', {
        params: {
          query: searchQuery,
          minPrice: minPrice || null,
          maxPrice: maxPrice || null,
          minYear: minYear || null,
          category: category || null,
          page: 0,
          pageSize: 20
        },
        withCredentials: true 
      });

      setResults(response.data.items);
    } catch (error) {
      console.error("Błąd wyszukiwania:", error);
      alert("Nie udało się pobrać ogłoszeń. Sprawdź konsolę.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Znajdź to, czego szukasz</h2>
        <p className="text-gray-500 mt-2">Przeszukuj tysiące ofert motoryzacyjnych w mgnieniu oka.</p>
      </div>

      <form onSubmit={handleSearch} className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="lg:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Fraza wyszukiwania</label>
            <div className="relative">
              <input
                type="text"
                placeholder="np. Audi A4, Opony zimowe, Silnik 1.9 TDI..."
                className="w-full p-3 pl-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cena od (zł)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cena do (zł)</label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">Rocznik od</label>
             <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              value={minYear}
              onChange={(e) => setMinYear(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategoria</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Wszystkie</option>
              <option value="Pojazd">Pojazdy</option>
              <option value="Część">Części</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 transform hover:scale-[1.01] shadow-md disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Szukanie...
            </span>
          ) : 'Szukaj ogłoszeń'}
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searched && results.length === 0 && !loading && (
          <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-xl text-gray-500 font-semibold">Brak wyników spełniających kryteria 😔</p>
            <p className="text-gray-400">Spróbuj zmienić filtry lub wpisać inną frazę.</p>
          </div>
        )}

        {results.map((item) => (
          <div key={item.objectID} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
            <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 relative">
               <span className="text-4xl">🚗</span>
               <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 text-xs font-bold rounded shadow text-gray-600">
                 {item.category}
               </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2">
                 <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight hover:text-blue-600 transition-colors cursor-pointer">
                    {item.title}
                 </h3>
              </div>
              
              <p className="text-2xl font-extrabold text-blue-600 mb-4">
                {item.price.toLocaleString('pl-PL')} PLN
              </p>
              <div className="text-sm text-gray-600 space-y-2 mb-4 flex-1">
                {item.brand && (
                   <div className="flex justify-between border-b border-gray-100 pb-1">
                     <span>Marka:</span> <span className="font-semibold text-gray-800">{item.brand}</span>
                   </div>
                )}
                {item.year && (
                   <div className="flex justify-between border-b border-gray-100 pb-1">
                     <span>Rocznik:</span> <span className="font-semibold text-gray-800">{item.year}</span>
                   </div>
                )}
                {item.mileage && (
                   <div className="flex justify-between border-b border-gray-100 pb-1">
                     <span>Przebieg:</span> <span className="font-semibold text-gray-800">{item.mileage.toLocaleString()} km</span>
                   </div>
                )}
                {!item.brand && !item.year && (
                    <p className="italic text-gray-400 text-xs">Brak szczegółowych danych technicznych w podglądzie.</p>
                )}
              </div>

              <button className="w-full bg-gray-900 text-white py-2.5 rounded-lg hover:bg-black transition font-medium mt-auto">
                Zobacz szczegóły
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;