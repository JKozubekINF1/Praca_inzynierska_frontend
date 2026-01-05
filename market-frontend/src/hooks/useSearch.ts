import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { SearchResultItem } from '../types';
import { announcementService } from '../services/announcementService';

export const useSearch = () => {
    const [searchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [category, setCategory] = useState(searchParams.get('category') || '');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [minYear, setMinYear] = useState('');

    const [results, setResults] = useState<SearchResultItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const search = async () => {
        setLoading(true);
        setHasSearched(true);
        try {
            const data = await announcementService.search({
                query: query || null,
                category: category || null,
                minPrice: minPrice || null,
                maxPrice: maxPrice || null,
                minYear: minYear || null,
                page: 0,
                pageSize: 20
            });
            setResults(data.items);
        } catch (error) {
            console.error("Błąd wyszukiwania:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (searchParams.toString()) {
            search();
        }
    }, []); 

    return {
        query, setQuery,
        category, setCategory,
        minPrice, setMinPrice,
        maxPrice, setMaxPrice,
        minYear, setMinYear,
        results,
        loading,
        hasSearched,
        search
    };
};