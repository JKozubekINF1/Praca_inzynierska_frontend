import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import type { LoginDto } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const location = useLocation();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('https://localhost:7143/api/auth/verify', {
          withCredentials: true,
        });
        if (response.status === 200) {
          navigate('/');
        }
      } catch (error) {
        console.log('Użytkownik nie jest zalogowany:', error);
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
      const response = await axios.post('https://localhost:7143/api/auth/login', formData, {
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

  return (
    <div className="flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center mb-4 text-xl font-semibold text-gray-900">Zaloguj się</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Nazwa użytkownika</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-gray-900"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Wprowadź nazwę użytkownika"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Hasło</label>
            <input
              type="password"
              className="w-full p-2 border rounded text-gray-900"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Wprowadź hasło"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Zaloguj się</button>
        </form>
        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Login;