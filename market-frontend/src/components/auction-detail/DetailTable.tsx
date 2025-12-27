import React from 'react';
import type { Announcement } from '../../types';

interface Props {
    announcement: Announcement;
}
const DetailRow = ({ label, value }: { label: string, value: string | number | undefined | null }) => {
    if (value === undefined || value === null || value === '') return null;
    return (
        <div className="flex justify-between py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 px-2 transition-colors">
            <span className="text-gray-500 font-medium">{label}</span>
            <span className="font-semibold text-gray-800 text-right">{value}</span>
        </div>
    );
};

export const DetailTable: React.FC<Props> = ({ announcement }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-4">Szczegóły ogłoszenia</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                <DetailRow label="ID Ogłoszenia" value={announcement.id} />
                <DetailRow label="Data dodania" value={new Date(announcement.createdAt).toLocaleDateString()} />
                <DetailRow label="Lokalizacja" value={announcement.location} />
                {announcement.category === 'Pojazd' && announcement.vehicleDetails && (
                    <>
                        <DetailRow label="Marka" value={announcement.vehicleDetails.brand} />
                        <DetailRow label="Model" value={announcement.vehicleDetails.model} />
                        <DetailRow label="Generacja" value={announcement.vehicleDetails.generation} />
                        <DetailRow label="Rok produkcji" value={announcement.vehicleDetails.year} />
                        <DetailRow label="Przebieg" value={`${announcement.vehicleDetails.mileage.toLocaleString()} km`} />
                        <DetailRow label="Pojemność" value={`${announcement.vehicleDetails.engineCapacity} cm³`} />
                        <DetailRow label="Moc" value={`${announcement.vehicleDetails.enginePower} KM`} />
                        <DetailRow label="Paliwo" value={announcement.vehicleDetails.fuelType} />
                        <DetailRow label="Skrzynia biegów" value={announcement.vehicleDetails.gearbox} />
                        <DetailRow label="Napęd" value={announcement.vehicleDetails.driveType} />
                        <DetailRow label="Nadwozie" value={announcement.vehicleDetails.bodyType} />
                        <DetailRow label="Kolor" value={announcement.vehicleDetails.color} />
                        <DetailRow label="Stan" value={announcement.vehicleDetails.state} />
                        <DetailRow label="VIN" value={announcement.vehicleDetails.vin} />
                    </>
                )}
                {announcement.category === 'Część' && announcement.partDetails && (
                    <>
                        <DetailRow label="Nazwa części" value={announcement.partDetails.partName} />
                        <DetailRow label="Numer katalogowy" value={announcement.partDetails.partNumber} />
                        <DetailRow label="Pasuje do" value={announcement.partDetails.compatibility} />
                        <DetailRow label="Stan" value={announcement.partDetails.state} />
                    </>
                )}
            </div>
            {announcement.features && announcement.features.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Wyposażenie</h3>
                    <div className="flex flex-wrap gap-2">
                        {announcement.features.map((feature, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700">
                                <svg className="w-3.5 h-3.5 mr-1.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                {feature.featureName}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};