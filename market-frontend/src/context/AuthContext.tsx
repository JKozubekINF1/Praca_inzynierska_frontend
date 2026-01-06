import React, { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface User {
    id: number;
    username: string;
    role: string;
    email?: string; 
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const authClient = axios.create({
        baseURL: API_BASE_URL,
        withCredentials: true,
    });

    const checkAuth = useCallback(async () => {
        try {
            const response = await authClient.get('/api/auth/verify');
            
            if (response.status === 200 && response.data.user) {
                setUser({
                    id: response.data.user.id,
                    username: response.data.user.username,
                    role: response.data.user.role,
                    email: response.data.user.email
                });
            } else {
                setUser(null);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await authClient.post('/api/auth/logout');
        } catch (error) {
            console.error('Błąd wylogowania:', error);
        }
        setUser(null);

    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated: !!user, 
            isLoading, 
            login, 
            logout,
            refreshAuth: checkAuth 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};