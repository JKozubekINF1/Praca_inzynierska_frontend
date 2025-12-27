import React from 'react';

interface Props {
    query: string; setQuery: (v: string) => void;
    category: string; setCategory: (v: string) => void;
    minPrice: string; setMinPrice: (v: string) => void;
    maxPrice: string; setMaxPrice: (v: string) => void;
    minYear: string; setMinYear: (v: string) => void;
    onSearch: () => void;
    loading: boolean;
}

export const SearchFilters: React.FC<Props> = (props) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        props.onSearch();
    };

    const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="lg:col-span-4">
                    <label className={labelClass}>Fraza wyszukiwania</label>
                    <input 
                        type="text" placeholder="np. Audi A4..." 
                        value={props.query} onChange={e => props.setQuery(e.target.value)} 
                        className={inputClass} 
                    />
                </div>

                <div>
                    <label className={labelClass}>Cena od (zł)</label>
                    <input 
                        type="number" value={props.minPrice} onChange={e => props.setMinPrice(e.target.value)} 
                        className={inputClass} 
                    />
                </div>
                <div>
                    <label className={labelClass}>Cena do (zł)</label>
                    <input 
                        type="number" value={props.maxPrice} onChange={e => props.setMaxPrice(e.target.value)} 
                        className={inputClass} 
                    />
                </div>
                <div>
                    <label className={labelClass}>Rocznik od</label>
                    <input 
                        type="number" value={props.minYear} onChange={e => props.setMinYear(e.target.value)} 
                        className={inputClass} 
                    />
                </div>
                <div>
                    <label className={labelClass}>Kategoria</label>
                    <select value={props.category} onChange={e => props.setCategory(e.target.value)} className={`${inputClass} bg-white`}>
                        <option value="">Wszystkie</option>
                        <option value="Pojazd">Pojazdy</option>
                        <option value="Część">Części</option>
                    </select>
                </div>
            </div>

            <button 
                type="submit" disabled={props.loading}
                className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition shadow-md disabled:opacity-70"
            >
                {props.loading ? 'Szukanie...' : 'Szukaj ogłoszeń'}
            </button>
        </form>
    );
};