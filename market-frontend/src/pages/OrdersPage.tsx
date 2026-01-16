import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { transactionService, type OrderHistoryItem } from '../services/transactionservice';
import { API_BASE_URL } from '../config';

const TrackingTimeline: React.FC<{ orderDate: string }> = ({ orderDate }) => {
  const date = new Date(orderDate);
  const now = new Date();
  const hoursDiff = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

  let currentStep = 1;
  if (hoursDiff > 2) currentStep = 2;
  if (hoursDiff > 5) currentStep = 3;
  if (hoursDiff > 24) currentStep = 4;

  const steps = [
    { step: 1, label: 'Nadano', icon: '📦' },
    { step: 2, label: 'W drodze', icon: '🚚' },
    { step: 3, label: 'Wydano kurierowi', icon: 'courier' },
    { step: 4, label: 'W punkcie odbioru', icon: 'check' },
  ];

  return (
    <div className="mt-6 select-none">
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded"></div>
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-yellow-400 -z-10 rounded transition-all duration-1000"
          style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
        ></div>

        {steps.map((s, index) => {
          const isCompleted = s.step <= currentStep;
          const isCurrent = s.step === currentStep;

          return (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`
                                w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 bg-white
                                ${
                                  isCompleted
                                    ? 'border-yellow-400 text-yellow-600'
                                    : 'border-gray-300 text-gray-300'
                                }
                                ${isCurrent ? 'ring-4 ring-yellow-100 scale-110' : ''}
                            `}
              >
                {s.step === 4 && isCompleted ? '✅' : '●'}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  isCompleted ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentStep === 4 && (
        <div className="mt-4 bg-green-50 text-green-800 p-3 rounded-xl border border-green-200 text-sm flex items-center gap-2 animate-fade-in">
          <span className="text-xl">📲</span>
          <div>
            <strong>Paczka gotowa do odbioru!</strong>
            <div className="text-xs">
              Kod odbioru: <strong>839201</strong> (QR w aplikacji)
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await transactionService.getMyOrders();
        setOrders(data);
      } catch (error) {
        console.error('Błąd pobierania zamówień', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getImgUrl = (path?: string) => {
    if (!path) return '/placeholder.png';
    return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
          📦 Moje Zamówienia
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm border border-gray-100">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Brak zamówień</h2>
            <p className="text-gray-500 mb-6">Nie kupiłeś jeszcze żadnego przedmiotu.</p>
            <Link
              to="/search"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Przeglądaj ogłoszenia
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-300"
              >
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-6 text-sm text-gray-500">
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider text-gray-400">
                        Data
                      </span>
                      <span className="font-medium text-gray-900">
                        {new Date(order.orderDate).toLocaleDateString('pl-PL')}
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider text-gray-400">
                        Kwota
                      </span>
                      <span className="font-medium text-gray-900">
                        {order.totalAmount.toFixed(2)} PLN
                      </span>
                    </div>
                    <div>
                      <span className="block text-xs uppercase font-bold tracking-wider text-gray-400">
                        Nr zamówienia
                      </span>
                      <span className="font-mono text-gray-700">#{order.orderId}</span>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                    {order.status}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden border border-gray-200">
                      <img
                        src={getImgUrl(order.announcementPhotoUrl)}
                        alt={order.announcementTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">
                        {order.announcementTitle}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        {/* Wyświetlamy ogólną nazwę zamiast ID z bazy jeśli to InPost */}
                        <p>
                          Metoda dostawy:{' '}
                          <strong>
                            {order.deliveryMethod === 'InPost'
                              ? 'Automat paczkowy'
                              : 'Odbiór osobisty'}
                          </strong>
                        </p>
                        {order.deliveryMethod === 'InPost' && (
                          <p className="text-xs text-gray-500">
                            Punkt: {order.deliveryPointName} <br />
                            Adres: {order.deliveryAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {order.deliveryMethod === 'InPost' && (
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        {/* Usunąłem logo InPost */}
                        <span className="text-xl">🚚</span>
                        <span className="text-sm font-bold text-gray-700">Śledzenie przesyłki</span>
                      </div>
                      <TrackingTimeline orderDate={order.orderDate} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
