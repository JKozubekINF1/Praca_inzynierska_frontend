import React, { useState } from 'react';
import { useProfile } from '../hooks/useProfile';
import { ProfileForm } from '../components/profile/ProfileForm';
import { PasswordForm } from '../components/profile/PasswordForm';
import { UserAnnouncementsList } from '../components/profile/UserAnnouncementsList';
import { ProfileCompletePrompt } from '../components/profile/ProfileCompletePrompt';

const ProfilePage: React.FC = () => {
    const { user, loading, error, successMessage, updateProfile, changePassword, clearMessages } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    if (loading && !user) return <div className="text-center py-10">Ładowanie profilu...</div>;

    const handleUpdate = async (data: any) => {
        const success = await updateProfile(data);
        if (success) setIsEditing(false);
        return success;
    };
    
    const isProfileIncomplete = user && (!user.name || !user.surname || !user.phoneNumber);
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Mój Profil</h1>
                    {!isEditing && !showPasswordForm && (
                        <div className="flex gap-2">
                            <button onClick={() => { setIsEditing(true); clearMessages(); }} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">Edytuj</button>
                            <button onClick={() => { setShowPasswordForm(true); clearMessages(); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition">Hasło</button>
                        </div>
                    )}
                </div>

                {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-200">{error}</div>}
                {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded border border-green-200">{successMessage}</div>}
                {isProfileIncomplete && !isEditing && !showPasswordForm && (
                    <ProfileCompletePrompt 
                        onEditClick={() => setIsEditing(true)} 
                    />
                )}

                {user && (
                    <>
                        {!showPasswordForm ? (
                            <ProfileForm 
                                user={user} 
                                onSubmit={handleUpdate} 
                                onCancel={() => setIsEditing(false)} 
                                isEditing={isEditing} 
                            />
                        ) : (
                            <PasswordForm 
                                onSubmit={changePassword} 
                                onCancel={() => setShowPasswordForm(false)} 
                            />
                        )}
                    </>
                )}

                <UserAnnouncementsList />
            </div>
        </div>
    );
};

export default ProfilePage;