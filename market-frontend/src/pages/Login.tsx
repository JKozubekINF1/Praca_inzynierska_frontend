import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { LoginDto } from '../types';
import { API_BASE_URL } from '../config';

interface LoginProps {
  setIsAuthenticated: (value: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState<LoginDto>({
    username: '',
    password: '',
  });

  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth/verify`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          navigate('/');
        }
      } catch (error) {
        console.log('Użytkownik nie jest zalogowany (oczekiwane na ekranie logowania).');
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/auth/login`, formData, {
        withCredentials: true,
      });
      setMessage('Zalogowano pomyślnie!');
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as string) || 'Błąd podczas logowania');
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-center mb-6 text-2xl font-bold text-gray-900">Zaloguj się</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className={labelClass}>Nazwa użytkownika</label>
            <input
              type="text"
              id="username"
              name="username"
              className={inputClass}
              value={formData.username}
              onChange={handleChange}
              placeholder="Wprowadź nazwę użytkownika"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className={labelClass}>Hasło</label>
            <input
              type="password"
              id="password"
              name="password"
              className={inputClass}
              value={formData.password}
              onChange={handleChange}
              placeholder="Wprowadź hasło"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md mt-2"
          >
            Zaloguj się
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${message.includes('pomyślnie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}
        
        <p className="mt-6 text-center text-gray-600 text-sm">
          Nie masz konta? <button onClick={() => navigate('/register')} className="text-blue-600 hover:underline font-medium">Zarejestruj się</button>
        </p>
      </div>
    </div>
  );
};

export default Login;