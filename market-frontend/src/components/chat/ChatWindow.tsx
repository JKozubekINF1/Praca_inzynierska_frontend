import React, { useEffect, useState, useRef } from 'react';
import { chatService, type ChatMessage } from '../../services/chatService';

interface ChatWindowProps {
  roomId: string;
  currentUser: { id: number; username: string };
  otherUserName: string;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ roomId, currentUser, otherUserName, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = chatService.subscribeToChat(roomId, (data) => {
      setMessages(data);
    });

    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await chatService.sendMessage(roomId, currentUser.id, currentUser.username, newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Błąd wysyłania:', error);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-white rounded-t-xl shadow-2xl flex flex-col border border-gray-200 z-[9999] animate-fade-in-up font-sans">
      <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="font-bold truncate max-w-[180px]">{otherUserName}</span>
        </div>
        <button onClick={onClose} className="hover:bg-blue-700 p-1 rounded transition">
          &times;
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-gray-400 text-sm mt-10">Rozpocznij rozmowę...</p>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] p-3 text-sm shadow-sm ${
                  isMe
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-2xl rounded-tl-none'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[10px] block mt-1 text-right ${
                    isMe ? 'text-blue-200' : 'text-gray-400'
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
        >
          <svg
            className="w-5 h-5 translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            ></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
