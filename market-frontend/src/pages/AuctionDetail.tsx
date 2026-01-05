import React from 'react';
import { Link } from 'react-router-dom';
import { useAuctionDetail } from '../hooks/useAuctionDetail';
import { Gallery } from '../components/auction-detail/Gallery';
import { DetailTable } from '../components/auction-detail/DetailTable';
import { SellerSidebar } from '../components/auction-detail/SellerSidebar';

const AuctionDetail: React.FC = () => {
    const { announcement, loading, error } = useAuctionDetail();

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error || !announcement) return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-50 text-gray-600">
            <h2 className="text-2xl font-bold mb-2">Błąd</h2>
            <p>{error || "Ogłoszenie nie istnieje"}</p>
            <Link to="/search" className="mt-4 text-blue-600 hover:underline font-medium">Wróć do wyszukiwarki</Link>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="mb-6 flex items-center text-sm text-gray-500">
                    <Link to="/search" className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Wróć do wyników
                    </Link>
                    <span className="mx-2 text-gray-300">/</span>
                    <span className="text-gray-800 font-medium truncate max-w-xs">{announcement.title}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">

                        <Gallery announcement={announcement} />
                        
                        <DetailTable announcement={announcement} />
                        
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold mb-4 text-gray-900">Opis</h2>
                            <p className="whitespace-pre-line text-gray-600 leading-relaxed text-lg">
                                {announcement.description}
                            </p>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <SellerSidebar announcement={announcement} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionDetail;