import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import type { RegisterDto } from '../types';
import { API_BASE_URL } from '../config';

const Register: React.FC = () => {
  const [formData, setFormData] = useState<RegisterDto>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validatePassword = (password: string): string | null => {
    if (!password || password.length < 8) {
      return 'Hasło musi mieć co najmniej 8 znaków.';
    }
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>?]).+$/;
    if (!passwordPattern.test(password)) {
      return 'Hasło musi zawierać co najmniej jedną wielką literę i jeden znak specjalny.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Hasła nie są zgodne!');
      return;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setMessage(passwordError);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formData);
      setMessage(typeof response.data === 'string' ? response.data : 'Rejestracja zakończona pomyślnie!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as string) || 'Błąd podczas rejestracji');
    }
  };

  const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-center mb-6 text-2xl font-bold text-gray-900">Utwórz konto</h2>
        
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
            <label htmlFor="email" className={labelClass}>Adres e-mail</label>
            <input
              type="email"
              id="email"
              name="email"
              className={inputClass}
              value={formData.email}
              onChange={handleChange}
              placeholder="Wprowadź e-mail"
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
          
          <div>
            <label htmlFor="confirmPassword" className={labelClass}>Potwierdź hasło</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className={inputClass}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Potwierdź hasło"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-md mt-2"
          >
            Zarejestruj się
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${message.includes('pomyślnie') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Masz już konto? <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline font-medium">Zaloguj się</button>
        </p>
      </div>
    </div>
  );
};

export default Register;