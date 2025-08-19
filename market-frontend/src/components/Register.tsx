import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import type { RegisterDto } from '../types';
import { useNavigate } from 'react-router-dom';

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
      const response = await axios.post('https://localhost:7143/api/auth/register', formData);
      setMessage(response.data as string);
      navigate('/login');
    } catch (error) {
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as string) || 'Błąd podczas rejestracji');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-900 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-center mb-4 text-xl font-semibold text-gray-900">Zarejestruj się</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700">Nazwa użytkownika</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Wprowadź nazwę użytkownika"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Adres e-mail</label>
            <input
              type="email"
              className="w-full p-2 border rounded"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Wprowadź e-mail"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">Hasło</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Wprowadź hasło"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-700">Potwierdź hasło</label>
            <input
              type="password"
              className="w-full p-2 border rounded"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Potwierdź hasło"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Zarejestruj się</button>
        </form>
        {message && <p className="mt-3 text-red-600 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default Register;