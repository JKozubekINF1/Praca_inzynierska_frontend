import React from 'react';
import type { SearchQuery } from '../../types';

interface Props {
    filters: SearchQuery;
    onChange: (key: keyof SearchQuery, value: any) => void;
    onSearch: () => void;
    loading: boolean;
}

export const SearchFilters: React.FC<Props> = ({ filters, onChange, onSearch, loading }) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onChange(name as keyof SearchQuery, value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6" onKeyDown={handleKeyDown}>
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">Filtry</h3>
                <button 
                    onClick={() => window.location.href = '/search'}
                    className="text-xs text-gray-400 hover:text-blue-600"
                >
                    Wyczyść
                </button>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Szukana fraza</label>
                <input 
                    type="text" 
                    name="query" 
                    placeholder="np. Audi A4, Alternator..." 
                    value={filters.query || ''} 
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategoria</label>
                <select 
                    name="category" 
                    value={filters.category || ''} 
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border"
                >
                    <option value="">Wszystkie</option>
                    <option value="Pojazd">Pojazdy</option>
                    <option value="Część">Części</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cena (PLN)</label>
                <div className="flex gap-2">
                    <input type="number" name="minPrice" placeholder="Od" value={filters.minPrice} onChange={handleChange} className="w-1/2 p-2 border rounded-lg" />
                    <input type="number" name="maxPrice" placeholder="Do" value={filters.maxPrice} onChange={handleChange} className="w-1/2 p-2 border rounded-lg" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stan</label>
                <select name="state" value={filters.state || ''} onChange={handleChange} className="w-full p-2 border rounded-lg">
                    <option value="">Wszystkie</option>
                    <option value="Używany">Używany</option>
                    <option value="Nowy">Nowy</option>
                    <option value="Uszkodzony">Uszkodzony</option>
                    <option value="Regenerowany">Regenerowany</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lokalizacja</label>
                <input 
                    type="text" 
                    name="location" 
                    placeholder="Miasto" 
                    value={filters.location || ''} 
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg"
                />
            </div>

            {filters.category === 'Pojazd' && (
                <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Szczegóły pojazdu</p>
                    
                    <div>
                        <input type="text" name="brand" placeholder="Marka" value={filters.brand || ''} onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                        <input type="text" name="model" placeholder="Model" value={filters.model || ''} onChange={handleChange} className="w-full p-2 border rounded-lg mb-2" />
                        <input type="text" name="generation" placeholder="Generacja (np. B8)" value={filters.generation || ''} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rok produkcji</label>
                        <div className="flex gap-2">
                            <input type="number" name="minYear" placeholder="Od" value={filters.minYear} onChange={handleChange} className="w-1/2 p-2 border rounded-lg" />
                            <input type="number" name="maxYear" placeholder="Do" value={filters.maxYear} onChange={handleChange} className="w-1/2 p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Przebieg (km)</label>
                        <div className="flex gap-2">
                            <input type="number" name="minMileage" placeholder="Od" value={filters.minMileage} onChange={handleChange} className="w-1/2 p-2 border rounded-lg" />
                            <input type="number" name="maxMileage" placeholder="Do" value={filters.maxMileage} onChange={handleChange} className="w-1/2 p-2 border rounded-lg" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Paliwo</label>
                        <select name="fuelType" value={filters.fuelType || ''} onChange={handleChange} className="w-full p-2 border rounded-lg">
                            <option value="">Wszystkie</option>
                            <option value="Benzyna">Benzyna</option>
                            <option value="Diesel">Diesel</option>
                            <option value="LPG">LPG</option>
                            <option value="Hybryda">Hybryda</option>
                            <option value="Elektryczny">Elektryczny</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Skrzynia biegów</label>
                        <select name="gearbox" value={filters.gearbox || ''} onChange={handleChange} className="w-full p-2 border rounded-lg">
                            <option value="">Wszystkie</option>
                            <option value="Manualna">Manualna</option>
                            <option value="Automatyczna">Automatyczna</option>
                        </select>
                    </div>
                </div>
            )}

            {filters.category === 'Część' && (
                <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Szczegóły części</p>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Numer części</label>
                        <input 
                            type="text" 
                            name="partNumber" 
                            placeholder="np. 1J0 907 503" 
                            value={filters.partNumber || ''} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-lg" 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kompatybilność</label>
                        <input 
                            type="text" 
                            name="compatibility" 
                            placeholder="np. Golf IV, Audi A3" 
                            value={filters.compatibility || ''} 
                            onChange={handleChange} 
                            className="w-full p-2 border rounded-lg" 
                        />
                    </div>
                </div>
            )}

            <div className="pt-4 mt-4 border-t border-gray-100">
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                    {loading ? 'Szukam...' : 'Pokaż wyniki'}
                </button>
            </div>
        </div>
    );
};