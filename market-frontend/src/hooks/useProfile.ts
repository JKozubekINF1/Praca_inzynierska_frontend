import { useState, useEffect } from 'react';
import type { UserDto, ChangePasswordDto } from '../types';
import { userService } from '../services/userService';

export const useProfile = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setUser(data);
    } catch (err) {
      setError('Nie udało się pobrać danych profilu.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (formData: UserDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.updateProfile(formData);
      setUser({ ...formData, hasCompletedProfilePrompt: true });

      setSuccessMessage(response.message || 'Profil zaktualizowany pomyślnie');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Błąd aktualizacji profilu';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };
  const changePassword = async (data: ChangePasswordDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await userService.changePassword(data);
      setSuccessMessage(response.message || 'Hasło zmienione pomyślnie');
      return true;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Błąd zmiany hasła';
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return { user, loading, error, successMessage, updateProfile, changePassword, clearMessages };
};
