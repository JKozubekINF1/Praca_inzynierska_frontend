import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import type { SearchQuery, SearchResponse } from '../types';

const initialFilters: SearchQuery = {
    page: 0,
    pageSize: 20,
    sortBy: 'newest',
    category: '',
    minPrice: '',
    maxPrice: '',
};

export const useSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [filters, setFilters] = useState<SearchQuery>(() => {
        const params = Object.fromEntries(searchParams.entries());
        return { ...initialFilters, ...params };
    });

    const [data, setData] = useState<SearchResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const isFirstRender = useRef(true);

    const search = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== '' && value !== undefined) {
                    params.append(key, value.toString());
                }
            });

            setSearchParams(params);

            const response = await axios.get<SearchResponse>(`https://localhost:7143/api/announcements/search?${params.toString()}`);
            setData(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filters, setSearchParams]);

    useEffect(() => {
        search();
    }, []); 

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        search();
    }, [filters.page, filters.sortBy]);

    const updateFilter = (key: keyof SearchQuery, value: any) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            page: 0
        }));
    };

    const setPage = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    return {
        results: data?.items || [],
        totalHits: data?.totalHits || 0,
        totalPages: data?.totalPages || 0,
        currentPage: data?.currentPage || 0,
        loading,
        filters,
        updateFilter,
        setPage,
        search
    };
};