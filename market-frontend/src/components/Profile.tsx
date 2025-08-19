import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserDto {
  username: string;
  email: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
  hasCompletedProfilePrompt: boolean;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

interface AnnouncementSummary {
  id: number;
  title: string;
  price: number;
  category: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDto | null>(null);
  const [announcements, setAnnouncements] = useState<AnnouncementSummary[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAdditionalFieldsPrompt, setShowAdditionalFieldsPrompt] = useState(false);
  const [formData, setFormData] = useState<UserDto>({ username: '', email: '', name: '', surname: '', phoneNumber: '', hasCompletedProfilePrompt: false });
  const [passwordData, setPasswordData] = useState<ChangePasswordDto>({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activatingAnnouncements, setActivatingAnnouncements] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://localhost:7143/api/Users/me', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Błąd podczas pobierania danych profilu');
        }

        const data = await response.json();
        setUser(data);
        setFormData(data);
        if (!data.hasCompletedProfilePrompt && (!data.name || !data.surname || !data.phoneNumber)) {
          setShowAdditionalFieldsPrompt(true);
        }
      } catch (err) {
        setError('Nie udało się pobrać danych profilu.');
      }

      try {
        const response = await fetch('https://localhost:7143/api/Announcements/user/me/announcements', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Błąd podczas pobierania ogłoszeń');
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (err) {
        setError('Nie udało się pobrać listy ogłoszeń.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleActivateAnnouncement = async (announcementId: number) => {
    setActivatingAnnouncements(prev => ({ ...prev, [announcementId]: true }));
    setError(null);
    
    try {
      const response = await fetch(`https://localhost:7143/api/Announcements/${announcementId}/activate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Wystąpił błąd podczas aktywacji ogłoszenia');
      }

      const data = await response.json();
      
      // Odśwież listę ogłoszeń
      const updatedAnnouncements = await fetch('https://localhost:7143/api/Announcements/user/me/announcements', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (updatedAnnouncements.ok) {
        const announcementsData = await updatedAnnouncements.json();
        setAnnouncements(announcementsData);
      }

      setSuccessMessage(data.message || 'Ogłoszenie aktywowane pomyślnie');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas aktywacji ogłoszenia');
    } finally {
      setActivatingAnnouncements(prev => ({ ...prev, [announcementId]: false }));
    }
  };

  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.username.trim()) errors.username = 'Nazwa użytkownika jest wymagana';
    else if (formData.username.length > 100) errors.username = 'Nazwa użytkownika nie może przekraczać 100 znaków';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) errors.email = 'Email jest wymagany';
    else if (!emailRegex.test(formData.email)) errors.email = 'Podaj poprawny adres email';

    if (formData.name && formData.name.length > 100) errors.name = 'Imię nie może przekraczać 100 znaków';
    if (formData.surname && formData.surname.length > 100) errors.surname = 'Nazwisko nie może przekraczać 100 znaków';
    if (formData.phoneNumber && formData.phoneNumber.length > 15) errors.phoneNumber = 'Numer telefonu nie może przekraczać 15 znaków';
    if (formData.phoneNumber && !/^\+?\d{9,15}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Podaj poprawny numer telefonu (9-15 cyfr, może zaczynać się od "+")';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordData.currentPassword.trim()) errors.currentPassword = 'Aktualne hasło jest wymagane';
    if (!passwordData.newPassword.trim()) errors.newPassword = 'Nowe hasło jest wymagane';
    else if (passwordData.newPassword.length < 8) errors.newPassword = 'Nowe hasło musi mieć co najmniej 8 znaków';
    else if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};:'",.<>?]).+$/.test(passwordData.newPassword)) {
      errors.newPassword = 'Nowe hasło musi zawierać co najmniej jedną wielką literę i jeden znak specjalny';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateProfileForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:7143/api/Users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, hasCompletedProfilePrompt: true }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (errorData.errors) {
          const transformedErrors: Record<string, string> = {};
          Object.keys(errorData.errors).forEach(key => {
            transformedErrors[key.toLowerCase()] = errorData.errors[key][0];
          });
          setFieldErrors(transformedErrors);
          
          if (transformedErrors.username) {
            setFieldErrors(prev => ({ ...prev, username: transformedErrors.username }));
          }
          if (transformedErrors.email) {
            setFieldErrors(prev => ({ ...prev, email: transformedErrors.email }));
          }
        } else {
          setError(errorData.message || 'Wystąpił błąd podczas aktualizacji profilu');
        }
        return;
      }

      const data = await response.json();
      setUser({ ...formData, hasCompletedProfilePrompt: true });
      setIsEditing(false);
      setShowAdditionalFieldsPrompt(false);
      setError(null);
      setSuccessMessage(data.message || 'Profil zaktualizowany pomyślnie');
    } catch (err) {
      console.error('Connection error:', err);
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://localhost:7143/api/Users/me/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(passwordData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (errorData.errors) {
          const transformedErrors: Record<string, string> = {};
          Object.keys(errorData.errors).forEach(key => {
            transformedErrors[key.toLowerCase()] = errorData.errors[key][0];
          });
          setFieldErrors(transformedErrors);
        } else {
          setError(errorData.message || 'Wystąpił błąd podczas zmiany hasła');
        }
        return;
      }

      const data = await response.json();
      setPasswordData({ currentPassword: '', newPassword: '' });
      setShowPasswordForm(false);
      setError(null);
      setSuccessMessage(data.message || 'Hasło zmienione pomyślnie');
    } catch (err) {
      console.error('Connection error:', err);
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipAdditionalFields = () => {
    setShowAdditionalFieldsPrompt(false);
    setFieldErrors({});
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (isEditing || showAdditionalFieldsPrompt) {
      setFormData(prev => ({ ...prev, [name]: value }));
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    } else {
      setPasswordData(prev => ({ ...prev, [name]: value }));
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const renderAdditionalFieldsPrompt = () => (
    <div className="mb-6 p-6 bg-blue-50 border-l-4 border-blue-500 text-gray-800">
      <h3 className="text-lg font-semibold mb-4">Uzupełnij dane profilu</h3>
      <p className="mb-4 text-sm">Podaj dodatkowe informacje, aby Twój profil był bardziej kompletny. Możesz pominąć ten krok.</p>
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
              fieldErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={100}
          />
          {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
          <input
            type="text"
            name="surname"
            value={formData.surname || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
              fieldErrors.surname ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={100}
          />
          {fieldErrors.surname && <p className="mt-1 text-sm text-red-600">{fieldErrors.surname}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Numer telefonu</label>
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber || ''}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
              fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            maxLength={15}
          />
          {fieldErrors.phoneNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>}
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz dane'}
          </button>
          <button
            type="button"
            onClick={handleSkipAdditionalFields}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
            disabled={loading}
          >
            Pomiń
          </button>
        </div>
      </form>
    </div>
  );

  const renderProfileForm = () => (
    <form onSubmit={handleProfileUpdate} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nazwa użytkownika</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.username ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
          disabled={!isEditing}
        />
        {fieldErrors.username && <p className="mt-1 text-sm text-red-600">{fieldErrors.username}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.email ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
          disabled={!isEditing}
        />
        {fieldErrors.email && <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
          disabled={!isEditing}
        />
        {fieldErrors.name && <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
        <input
          type="text"
          name="surname"
          value={formData.surname || ''}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.surname ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
          disabled={!isEditing}
        />
        {fieldErrors.surname && <p className="mt-1 text-sm text-red-600">{fieldErrors.surname}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Numer telefonu</label>
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber || ''}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={15}
          disabled={!isEditing}
        />
        {fieldErrors.phoneNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>}
      </div>
      {isEditing && (
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              setFormData(user!);
              setFieldErrors({});
              setError(null);
            }}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
          >
            Anuluj
          </button>
        </div>
      )}
    </form>
  );

  const renderPasswordForm = () => (
    <form onSubmit={handlePasswordChange} className="space-y-6 mt-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Aktualne hasło*</label>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.currentPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.currentPassword}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nowe hasło*</label>
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
            fieldErrors.newPassword ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.newPassword && <p className="mt-1 text-sm text-red-600">{fieldErrors.newPassword}</p>}
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
          {loading ? 'Zmiana hasła...' : 'Zmień hasło'}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowPasswordForm(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
            setFieldErrors({});
            setError(null);
          }}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md"
        >
          Anuluj
        </button>
      </div>
    </form>
  );

  const renderAnnouncements = () => (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Moje ogłoszenia</h3>
      {announcements.length === 0 ? (
        <p className="mt-4 text-gray-600">Nie masz jeszcze żadnych ogłoszeń.</p>
      ) : (
        <div className="mt-4 space-y-4">
          {announcements.map(announcement => {
            const isExpired = !announcement.isActive;
            const isActivating = activatingAnnouncements[announcement.id];
            
            return (
              <div key={announcement.id} className={`p-4 rounded-md shadow-sm ${
                isExpired ? 'bg-yellow-50 border-l-4 border-yellow-500' : 'bg-gray-50'
              }`}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900">{announcement.title}</h4>
                    <p className="text-sm text-gray-600">Kategoria: {announcement.category}</p>
                    <p className="text-sm text-gray-600">Cena: {announcement.price.toFixed(2)} PLN</p>
                    <p className="text-sm text-gray-600">
                      Data utworzenia: {new Date(announcement.createdAt).toLocaleDateString()}
                    </p>
                    <p className={`text-sm ${
                      isExpired ? 'text-red-600 font-medium' : 'text-gray-600'
                    }`}>
                      Ważne do: {new Date(announcement.expiresAt).toLocaleDateString()}
                      {isExpired && ' (WYGASŁE)'}
                    </p>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/announcements/${announcement.id}`)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                    >
                      Szczegóły
                    </button>
                    
                    {isExpired && (
                      <button
                        onClick={() => handleActivateAnnouncement(announcement.id)}
                        disabled={isActivating}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md disabled:opacity-50"
                      >
                        {isActivating ? 'Aktywowanie...' : 'Aktywuj'}
                      </button>
                    )}
                    
                    {!isExpired && (
                      <button
                        onClick={() => handleActivateAnnouncement(announcement.id)}
                        disabled={isActivating}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md disabled:opacity-50"
                      >
                        {isActivating ? 'Przedłużanie...' : 'Przedłuż'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Profil użytkownika</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700">
              <p>{successMessage}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : user ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Dane osobowe</h2>
                {!isEditing && !showPasswordForm && !showAdditionalFieldsPrompt && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Edytuj profil
                    </button>
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                    >
                      Zmień hasło
                    </button>
                  </div>
                )}
              </div>
              {showAdditionalFieldsPrompt ? renderAdditionalFieldsPrompt() : !showPasswordForm ? renderProfileForm() : renderPasswordForm()}
              {renderAnnouncements()}
            </>
          ) : (
            <p className="text-gray-600 text-center">Nie udało się załadować danych profilu.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;