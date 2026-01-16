import React, { useState } from 'react';
import type { ChangePasswordDto } from '../../types';

interface Props {
  onSubmit: (data: ChangePasswordDto) => Promise<boolean>;
  onCancel: () => void;
}

export const PasswordForm: React.FC<Props> = ({ onSubmit, onCancel }) => {
  const [data, setData] = useState({ currentPassword: '', newPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(data);
    if (success) onCancel();
  };

  const inputClass =
    'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 text-black';

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200"
    >
      <h3 className="font-bold text-lg mb-2 text-black">Zmiana hasła</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Aktualne hasło</label>
        <input
          type="password"
          value={data.currentPassword}
          onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nowe hasło</label>
        <input
          type="password"
          value={data.newPassword}
          onChange={(e) => setData({ ...data, newPassword: e.target.value })}
          className={inputClass}
          required
        />
      </div>
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
        >
          Zmień hasło
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-medium"
        >
          Anuluj
        </button>
      </div>
    </form>
  );
};
