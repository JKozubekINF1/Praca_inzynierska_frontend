import React, { useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import type { LoginDto } from '../types';
import { API_BASE_URL } from '../config';

const Login: React.FC = () => {
  const [formData, setFormData] = useState<Omit<LoginDto, 'recaptchaToken'>>({
    username: '',
    password: '',
  });

  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!captchaToken) {
      setMessage('Potwierdź, że nie jesteś robotem.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/login`,
        {
          ...formData,
          recaptchaToken: captchaToken,
        },
        { withCredentials: true }
      );

      setMessage('Zalogowano pomyślnie!');
      window.location.href = '/';
    } catch (error) {
      const axiosError = error as AxiosError<any>;

      let errorMsg = 'Błąd podczas logowania';
      if (axiosError.response?.data) {
        const data = axiosError.response.data;

        if (typeof data === 'string') {
          errorMsg = data;
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.Message) {
          errorMsg = data.Message;
        } else if (data.title) {
          errorMsg = data.title;
        }
      }

      setMessage(errorMsg);
      recaptchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  const inputClass =
    'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-gray-100">
        <h2 className="text-center mb-6 text-2xl font-bold text-gray-900">Zaloguj się</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className={labelClass}>
              Nazwa użytkownika
            </label>
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
            <label htmlFor="password" className={labelClass}>
              Hasło
            </label>
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

          <div className="flex justify-center mt-4 mb-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={SITE_KEY}
              onChange={(token) => setCaptchaToken(token)}
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
          <div
            className={`mt-4 p-3 rounded-lg text-center text-sm font-medium border ${
              message.includes('pomyślnie')
                ? 'bg-green-50 text-green-700 border-green-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        <p className="mt-6 text-center text-gray-600 text-sm">
          Nie masz konta?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 hover:underline font-medium"
          >
            Zarejestruj się
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
