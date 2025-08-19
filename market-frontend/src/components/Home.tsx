import React from 'react';
import { Link } from 'react-router-dom';

const auctions = [
  { id: 1, title: 'BMW E36 1995', price: 5000, image: 'https://via.placeholder.com/200x150' },
  { id: 2, title: 'Felgi 17"', price: 800, image: 'https://via.placeholder.com/200x150' },
  { id: 3, title: 'Silnik 2.0L', price: 2000, image: 'https://via.placeholder.com/200x150' },
];

const Home: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-blue-600 text-white p-12 text-center rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-4">Kup i sprzedaj samochody oraz części szybko i bezpiecznie</h1>
        <Link to="/auction/1" className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-gray-100">Rozpocznij</Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Popularne aukcje</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <div key={auction.id} className="bg-white text-gray-900 p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
            <img src={auction.image} alt={auction.title} className="w-full h-40 object-cover rounded" />
            <h3 className="text-lg font-medium mt-2">{auction.title}</h3>
            <p className="text-green-600 font-bold mt-1">{auction.price} PLN</p>
            <Link to={`/auction/${auction.id}`} className="mt-2 w-full bg-blue-600 text-white py-1 rounded text-center block hover:bg-blue-700">Szczegóły</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;