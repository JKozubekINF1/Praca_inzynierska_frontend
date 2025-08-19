import React from 'react';
import { useParams } from 'react-router-dom';

const AuctionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const auction = { id: parseInt(id || '1'), title: 'BMW E36 1995', price: 5000, description: 'Samochód w dobrym stanie, rok 1995.' };

  return (
    <div className="p-6">
      <div className="bg-white text-gray-900 p-4 rounded-lg shadow-md">
        <img src="https://via.placeholder.com/600x400" alt={auction.title} className="w-full h-64 object-cover rounded" />
        <h2 className="text-2xl font-semibold mt-4">{auction.title}</h2>
        <p className="text-green-600 font-bold mt-2">{auction.price} PLN</p>
        <p className="mt-2">{auction.description}</p>
        <div className="mt-4">
          <input type="number" defaultValue={auction.price} className="border p-2 rounded w-full mb-2" placeholder="Twoja oferta" />
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Złóż ofertę</button>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium">Kontakt ze sprzedawcą</h3>
          <textarea className="border p-2 rounded w-full mt-2" placeholder="Napisz wiadomość..."></textarea>
          <button className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Wyślij</button>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;