import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useProfile } from '../hooks/useProfile';
import { ProfileForm } from '../components/profile/ProfileForm';
import { PasswordForm } from '../components/profile/PasswordForm';
import { UserAnnouncementsList } from '../components/profile/UserAnnouncementsList';
import { ProfileCompletePrompt } from '../components/profile/ProfileCompletePrompt';

const ProfilePage: React.FC = () => {
  const { user, loading, updateProfile, changePassword, clearMessages } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  if (loading && !user) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-blue-600 font-bold text-xl">
        Ładowanie profilu...
      </div>
    );
  }

  const handleUpdate = async (data: any) => {
    const toastId = toast.loading('Aktualizowanie profilu...');
    const success = await updateProfile(data);

    if (success) {
      toast.success('Profil został zaktualizowany!', { id: toastId });
      setIsEditing(false);
    } else {
      toast.error('Nie udało się zaktualizować profilu.', { id: toastId });
    }
    return success;
  };

  const handlePasswordSubmit = async (data: any) => {
    const toastId = toast.loading('Zmienianie hasła...');
    const success = await changePassword(data);

    if (success) {
      toast.success('Hasło zostało zmienione.', { id: toastId });
      setShowPasswordForm(false);
    } else {
      toast.error('Nie udało się zmienić hasła. Sprawdź obecne hasło.', { id: toastId });
    }

    return success;
  };

  const isProfileIncomplete = user && (!user.name || !user.surname || !user.phoneNumber);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
          <h1 className="text-3xl font-extrabold text-gray-900">Mój Profil</h1>

          {!isEditing && !showPasswordForm && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(true);
                  clearMessages();
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm"
              >
                Edytuj dane
              </button>
              <button
                onClick={() => {
                  setShowPasswordForm(true);
                  clearMessages();
                }}
                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-50 transition shadow-sm"
              >
                Zmień hasło
              </button>
            </div>
          )}
        </div>

        {isProfileIncomplete && !isEditing && !showPasswordForm && (
          <div className="mb-8">
            <ProfileCompletePrompt onEditClick={() => setIsEditing(true)} />
          </div>
        )}

        {user && (
          <div className="mb-10">
            {!showPasswordForm ? (
              <ProfileForm
                user={user}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditing(false)}
                isEditing={isEditing}
              />
            ) : (
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">Zmiana hasła</h3>
                <PasswordForm
                  onSubmit={handlePasswordSubmit}
                  onCancel={() => setShowPasswordForm(false)}
                />
              </div>
            )}
          </div>
        )}

        <UserAnnouncementsList />
      </div>
    </div>
  );
};

export default ProfilePage;
