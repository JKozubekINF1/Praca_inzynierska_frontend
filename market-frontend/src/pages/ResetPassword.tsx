import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location.state?.email || '';

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      toast.error('Hasła nie są identyczne.');
      return;
    }
    if (passwords.new.length < 8) {
      toast.error('Hasło musi mieć min. 8 znaków.');
      return;
    }
    if (code.length !== 6) {
      toast.error('Kod musi mieć 6 znaków.');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(email, code, passwords.new);
      toast.success('Hasło zostało zmienione! Możesz się zalogować.');
      navigate('/login');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Błąd resetowania hasła.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Zmień hasło</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Wpisz kod weryfikacyjny (6 cyfr), który otrzymałeś na maila.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kod (6 cyfr)</label>
            <input
              type="text"
              required
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none tracking-widest text-center font-bold text-lg"
              placeholder="XXXXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nowe hasło</label>
            <input
              type="password"
              required
              value={passwords.new}
              onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Min. 8 znaków, duża litera, znak spec."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Powtórz hasło</label>
            <input
              type="password"
              required
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Powtórz nowe hasło"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 mt-4"
          >
            {loading ? 'Zapisywanie...' : 'Zmień hasło'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:underline">
            Anuluj
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
