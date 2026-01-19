import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useAuctionDetail } from '../hooks/useAuctionDetail';
import { useWallet } from '../hooks/useWallet';
import { SellerSidebar } from '../components/auction-detail/SellerSidebar';
import { Gallery } from '../components/auction-detail/Gallery';
import { DetailTable } from '../components/auction-detail/DetailTable';
import InPostModal from '../components/common/InPostModal';
import WalletModal from '../components/common/WalletModal';
import ChatWindow from '../components/chat/ChatWindow';
import { getChatRoomId } from '../services/chatService';

const AuctionDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuth();
  const { announcement, loading, error } = useAuctionDetail();
  const { balance, fetchBalance, buy } = useWallet();

  const [isInPostOpen, setIsInPostOpen] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<{
    name: string;
    address: { line1: string; line2: string };
  } | null>(null);

  const handleChatOpen = () => {
    if (!user) {
      toast.error('Musisz się zalogować, aby napisać wiadomość.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }

    const sellerId = announcement?.userId || announcement?.user?.id;

    if (!sellerId) {
      toast.error('Błąd danych sprzedawcy (brak ID).');
      return;
    }

    if (user.id === sellerId) {
      toast.error('Nie możesz pisać do siebie (to Twoje ogłoszenie).');
      return;
    }

    setIsChatOpen(true);
  };

  const handleBuyClick = () => {
    if (!user) {
      toast.error('Musisz się zalogować, aby dokonać zakupu.');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    setIsWalletOpen(true);
  };

  const handlePurchase = async () => {
    if (!announcement) return;
    try {
      await buy({
        announcementId: announcement.id,
        deliveryMethod: selectedPoint ? 'InPost' : 'Personal',
        deliveryPointName: selectedPoint?.name,
        deliveryAddress: selectedPoint
          ? `${selectedPoint.address.line1}, ${selectedPoint.address.line2}`
          : null,
      });
      toast.success('Przedmiot został zakupiony!');
      navigate('/orders');
    } catch (e: any) {
      toast.error(e.message || 'Wystąpił błąd podczas zakupu.');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );

  if (error || !announcement)
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <h2 className="text-2xl font-bold mb-2">Ogłoszenie nie istnieje</h2>
        <button onClick={() => navigate('/search')} className="text-blue-600 hover:underline">
          Wróć do wyszukiwarki
        </button>
      </div>
    );

  const sellerId = announcement.userId || announcement.user?.id;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-blue-600 transition font-medium group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Wróć do wyników
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Gallery announcement={announcement} />
            <DetailTable announcement={announcement} />
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Opis</h2>
              <p className="whitespace-pre-line text-gray-600 text-lg leading-relaxed">
                {announcement.description}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            {announcement.category === 'Część' && (
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                <div className="mb-6">
                  <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">
                    Cena
                  </h3>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {announcement.price.toLocaleString('pl-PL')}{' '}
                    <span className="text-xl text-gray-500">PLN</span>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Metoda dostawy
                  </label>
                  {!selectedPoint ? (
                    <button
                      onClick={() => setIsInPostOpen(true)}
                      className="w-full bg-white border-2 border-yellow-400 border-dashed text-gray-700 hover:bg-yellow-50 hover:border-yellow-500 font-medium py-3 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      + Wybierz Automat Paczkowy
                    </button>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200 animate-fade-in">
                      <div className="text-xs text-green-800 font-bold uppercase mb-1">
                        Wybrany punkt
                      </div>
                      <div className="font-bold text-gray-900">{selectedPoint.name}</div>
                      <div className="text-xs text-gray-600 truncate">
                        {selectedPoint.address?.line1}
                      </div>
                      <button
                        onClick={() => setIsInPostOpen(true)}
                        className="text-blue-600 text-xs font-bold hover:underline mt-2"
                      >
                        ZMIEŃ
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleBuyClick}
                  className="w-full bg-black text-white hover:bg-gray-800 font-bold py-4 rounded-xl text-lg shadow-xl hover:shadow-2xl transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  KUP TERAZ
                </button>
              </div>
            )}

            <SellerSidebar announcement={announcement} onChatClick={handleChatOpen} />
          </div>
        </div>
      </div>

      <InPostModal
        isOpen={isInPostOpen}
        onClose={() => setIsInPostOpen(false)}
        onSelect={setSelectedPoint}
      />

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentBalance={balance}
        priceToPay={announcement.price}
        onTopUpSuccess={fetchBalance}
        onPaymentConfirm={handlePurchase}
      />

      {isChatOpen && user && sellerId && (
        <ChatWindow
          roomId={getChatRoomId(announcement.id, user.id, sellerId)}
          currentUser={{ id: user.id, username: user.username }}
          otherUserName={announcement.user?.username || 'Sprzedawca'}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default AuctionDetail;
