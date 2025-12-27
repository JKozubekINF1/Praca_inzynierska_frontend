import React, { useState} from 'react';
import type { UserDto } from '../../types';

interface Props {
    user: UserDto;
    onSubmit: (data: UserDto) => Promise<boolean>;
    onCancel: () => void;
    isEditing: boolean;
}

export const ProfileForm: React.FC<Props> = ({ user, onSubmit, onCancel, isEditing }) => {
    const [formData, setFormData] = useState<UserDto>(user);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const inputClass = "w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-black";
    const labelClass = "block text-sm font-medium text-gray-700 mb-1";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Nazwa użytkownika</label>
                    <input name="username" value={formData.username} className={inputClass} disabled />
                </div>
                <div>
                    <label className={labelClass}>Email</label>
                    <input name="email" value={formData.email} onChange={handleChange} className={inputClass} disabled={!isEditing} />
                </div>
                <div>
                    <label className={labelClass}>Imię</label>
                    <input name="name" value={formData.name || ''} onChange={handleChange} className={inputClass} disabled={!isEditing} />
                </div>
                <div>
                    <label className={labelClass}>Nazwisko</label>
                    <input name="surname" value={formData.surname || ''} onChange={handleChange} className={inputClass} disabled={!isEditing} />
                </div>
                <div>
                    <label className={labelClass}>Telefon</label>
                    <input name="phoneNumber" value={formData.phoneNumber || ''} onChange={handleChange} className={inputClass} disabled={!isEditing} />
                </div>
            </div>

            {isEditing && (
                <div className="flex gap-3 pt-2">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">Zapisz</button>
                    <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 font-medium">Anuluj</button>
                </div>
            )}
        </form>
    );
};