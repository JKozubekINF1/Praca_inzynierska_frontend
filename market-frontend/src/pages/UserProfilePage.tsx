import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/admin/users/${id}`, {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (error) {
        toast.error('Nie udało się pobrać danych użytkownika.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Ładowanie...</div>;
  if (!user) return <div className="text-center mt-10">Nie znaleziono użytkownika.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`p-6 text-white ${user.isBanned ? 'bg-red-600' : 'bg-blue-600'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{user.username}</h1>
              <p className="opacity-90">{user.email}</p>
            </div>
            <div className="text-right">
              <span className="bg-white/20 px-3 py-1 rounded text-sm font-bold">{user.role}</span>
              {user.isBanned && (
                <div className="mt-2 font-bold bg-white text-red-600 px-2 py-1 rounded text-xs text-center">
                  ZBANOWANY
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold mb-4">Szczegóły konta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <p>
              <strong>ID:</strong> {user.id}
            </p>
            <p>
              <strong>Telefon:</strong> {user.phoneNumber || 'Brak'}
            </p>
            <p>
              <strong>Imię:</strong> {user.name || 'Brak'}
            </p>
            <p>
              <strong>Nazwisko:</strong> {user.surname || 'Brak'}
            </p>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            Ogłoszenia użytkownika ({user.announcements?.length || 0})
          </h2>
          {user.announcements && user.announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.announcements.map((ad: any) => (
                <Link
                  to={`/announcements/${ad.id}`}
                  key={ad.id}
                  className="block border rounded-lg hover:shadow-md transition p-3"
                >
                  <div className="flex items-center space-x-3">
                    {ad.photoUrl ? (
                      <img
                        src={`${API_BASE_URL}/${ad.photoUrl}`}
                        alt={ad.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        Brak foto
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-blue-600 truncate">{ad.title}</h3>
                      <p className="text-gray-600 font-bold">{ad.price} zł</p>
                      <p className={`text-xs ${ad.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {ad.isActive ? 'Aktywne' : 'Nieaktywne'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Ten użytkownik nie dodał jeszcze żadnych ogłoszeń.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
