import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { chatService, type ChatSummary } from '../services/chatService';
import ChatWindow from '../components/chat/ChatWindow';

const Messages: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState<ChatSummary | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchChats = async () => {
      try {
        const data = await chatService.getMyChats(user.id);
        data.sort((a, b) => (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0));
        setChats(data);
      } catch (error) {
        console.error('Błąd pobierania rozmów', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Moje Wiadomości</h1>

        {chats.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm text-center">
            <h2 className="text-xl font-bold text-gray-400 mb-2">Pusta skrzynka</h2>
            <p className="text-gray-500">Nie prowadzisz jeszcze żadnych rozmów.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {chats.map((chat) => {
              const isMeBuyer = user?.id === chat.buyerId;
              const role = isMeBuyer ? 'Rozmowa ze sprzedającym' : 'Rozmowa z kupującym';

              return (
                <div
                  key={chat.roomId}
                  onClick={() => setActiveChat(chat)}
                  className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 flex justify-between items-center group"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${
                          isMeBuyer ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {isMeBuyer ? 'Kupuję' : 'Sprzedaję'}
                      </span>
                      <span className="text-sm text-gray-400">
                        Ogłoszenie #{chat.announcementId}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition">
                      {role}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1 truncate max-w-md">
                      {chat.lastMessage ? chat.lastMessage.text : 'Brak wiadomości...'}
                    </p>
                  </div>
                  <div className="text-right">
                    {chat.lastMessage && (
                      <span className="text-xs text-gray-400">
                        {new Date(chat.lastMessage.timestamp).toLocaleDateString()}
                      </span>
                    )}
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mt-2 group-hover:bg-blue-600 group-hover:text-white transition ml-auto">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {activeChat && user && (
        <ChatWindow
          roomId={activeChat.roomId}
          currentUser={{ id: user.id, username: user.username }}
          otherUserName={user.id === activeChat.buyerId ? 'Sprzedawca' : 'Kupujący'}
          onClose={() => setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Messages;
