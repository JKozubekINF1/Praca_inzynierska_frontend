import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VehicleData {
    brand: string;
    model: string;
    year: number;
    equipmentVersion?: string;
    bodyType: string;
    color: string;
    engine: string;
    fuelType: string;
    transmission: string;
    drive: string;
    mileage: number;
    condition: string;
    history: string;
    equipment: string;
    formalities: string;
}

interface PartData {
    partName: string;
    partNumber?: string;
    condition: string;
    compatibility: string;
    engineVersion?: string;
}

interface AnnouncementDto {
    title: string;
    description: string;
    price: number;
    isNegotiable: boolean;
    category: string;
    phoneNumber: string;
    contactPreference: string;
    vehicleData?: VehicleData;
    partData?: PartData;
}

const AddAnnouncementPage: React.FC = () => {
    const navigate = useNavigate();
    const [category, setCategory] = useState<"Vehicle" | "Part" | "">("");
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<string>('');
    const [isNegotiable, setIsNegotiable] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [contactPreference, setContactPreference] = useState('');
    const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
    const [partData, setPartData] = useState<PartData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCategory = e.target.value as "Vehicle" | "Part" | "";
        setCategory(newCategory);
        setFieldErrors({});
        setError(null);

        if (newCategory === "Vehicle") {
            setPartData(null);
            setVehicleData({
                brand: '', model: '', year: 0, equipmentVersion: '', bodyType: '', color: '', 
                engine: '', fuelType: '', transmission: '', drive: '', mileage: 0, 
                condition: '', history: '', equipment: '', formalities: ''
            });
        } else if (newCategory === "Part") {
            setVehicleData(null);
            setPartData({ partName: '', partNumber: '', condition: '', compatibility: '', engineVersion: '' });
        }
    };

    const handleVehicleDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVehicleData(prev => prev ? { ...prev, [name]: value } : null);
        setFieldErrors(prev => ({ ...prev, [`vehicleData.${name}`]: '' }));
    };

    const handlePartDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPartData(prev => prev ? { ...prev, [name]: value } : null);
        setFieldErrors(prev => ({ ...prev, [`partData.${name}`]: '' }));
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!title.trim()) errors.title = 'Tytuł jest wymagany';
        else if (title.length > 100) errors.title = 'Tytuł nie może przekraczać 100 znaków';
        
        if (!description.trim()) errors.description = 'Opis jest wymagany';
        else if (description.length > 2000) errors.description = 'Opis nie może przekraczać 2000 znaków';
        
        const priceNum = parseFloat(price);
        if (isNaN(priceNum)) errors.price = 'Podaj poprawną cenę';
        else if (priceNum <= 0) errors.price = 'Cena musi być większa od 0';
        
        if (!phoneNumber.trim()) errors.phoneNumber = 'Numer telefonu jest wymagany';
        else if (phoneNumber.length > 15) errors.phoneNumber = 'Numer telefonu nie może przekraczać 15 znaków';
        
        if (!contactPreference) errors.contactPreference = 'Wybierz preferowany kontakt';
        
        if (category === "Vehicle" && vehicleData) {
            if (!vehicleData.brand.trim()) errors['vehicleData.brand'] = 'Marka jest wymagana';
            if (!vehicleData.model.trim()) errors['vehicleData.model'] = 'Model jest wymagany';
            if (vehicleData.year < 1900 || vehicleData.year > 2100) errors['vehicleData.year'] = 'Podaj poprawny rok (1900-2100)';
            if (vehicleData.mileage < 0) errors['vehicleData.mileage'] = 'Przebieg nie może być ujemny';
            if (!vehicleData.color.trim()) errors['vehicleData.color'] = 'Kolor jest wymagany';
            if (!vehicleData.engine.trim()) errors['vehicleData.engine'] = 'Silnik jest wymagany';
            if (!vehicleData.drive.trim()) errors['vehicleData.drive'] = 'Napęd jest wymagany';
        }
        
        if (category === "Part" && partData) {
            if (!partData.partName.trim()) errors['partData.partName'] = 'Nazwa części jest wymagana';
            if (!partData.condition.trim()) errors['partData.condition'] = 'Stan jest wymagany';
            if (!partData.compatibility.trim()) errors['partData.compatibility'] = 'Kompatybilność jest wymagana';
        }
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        if (!validateForm()) {
            setLoading(false);
            return;
        }

        const categoryMap = {
            "Vehicle": "Pojazd",
            "Part": "Część"
        };

        const announcementData: AnnouncementDto = {
            title: title.trim(),
            description: description.trim(),
            price: parseFloat(price),
            isNegotiable,
            category: categoryMap[category as keyof typeof categoryMap], 
            phoneNumber: phoneNumber.trim(),
            contactPreference,
            vehicleData: category === "Vehicle" ? {
                ...vehicleData!,
                year: Number(vehicleData!.year),
                mileage: Number(vehicleData!.mileage)
            } : undefined,
            partData: category === "Part" ? partData! : undefined
        };

        try {
            const response = await fetch('https://localhost:7143/api/Announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(announcementData),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                
                if (errorData.errors) {
                    const backendErrors: Record<string, string[]> = errorData.errors;
                    const transformedErrors: Record<string, string> = {};
                    
                    Object.keys(backendErrors).forEach(key => {
                        const fieldName = key.replace('VehicleData.', 'vehicleData.').replace('PartData.', 'partData.');
                        transformedErrors[fieldName] = backendErrors[key][0];
                    });
                    
                    setFieldErrors(transformedErrors);
                } else {
                    setError(errorData.title || 'Wystąpił błąd podczas dodawania ogłoszenia');
                }
                return;
            }

            const data = await response.json();
            navigate('/announcements', { 
                state: { successMessage: 'Ogłoszenie dodane pomyślnie!' } 
            });
        } catch (err) {
            console.error("Connection error:", err);
            setError('Błąd połączenia z serwerem');
        } finally {
            setLoading(false);
        }
    };

    const renderCategorySpecificFields = () => {
        if (category === "Vehicle" && vehicleData) {
            return (
                <div className="space-y-4 mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Dane pojazdu</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['brand', 'model', 'year', 'bodyType', 'color', 'engine', 'fuelType', 
                         'transmission', 'drive', 'mileage'].map(field => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {getFieldLabel(field)}*
                                </label>
                                <input
                                    type={field === 'year' || field === 'mileage' ? 'number' : 'text'}
                                    name={field}
                                    value={(vehicleData as any)[field] || ''}
                                    onChange={handleVehicleDataChange}
                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                        fieldErrors[`vehicleData.${field}`] ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    min={field === 'year' ? '1900' : field === 'mileage' ? '0' : undefined}
                                    max={field === 'year' ? '2100' : undefined}
                                    required
                                />
                                {fieldErrors[`vehicleData.${field}`] && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors[`vehicleData.${field}`]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 space-y-4">
                        {['condition', 'history', 'equipment', 'formalities'].map(field => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {getFieldLabel(field)}*
                                </label>
                                <textarea
                                    name={field}
                                    value={(vehicleData as any)[field] || ''}
                                    onChange={handleVehicleDataChange}
                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 text-gray-900 bg-white ${
                                        fieldErrors[`vehicleData.${field}`] ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required
                                />
                                {fieldErrors[`vehicleData.${field}`] && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors[`vehicleData.${field}`]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        
        if (category === "Part" && partData) {
            return (
                <div className="space-y-4 mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Dane części</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['partName', 'partNumber', 'condition', 'engineVersion'].map(field => (
                            <div key={field}>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {getFieldLabel(field)}{field !== 'partNumber' && field !== 'engineVersion' ? '*' : ''}
                                </label>
                                <input
                                    type="text"
                                    name={field}
                                    value={(partData as any)[field] || ''}
                                    onChange={handlePartDataChange}
                                    className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                        fieldErrors[`partData.${field}`] ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    required={field !== 'partNumber' && field !== 'engineVersion'}
                                />
                                {fieldErrors[`partData.${field}`] && (
                                    <p className="mt-1 text-sm text-red-600">{fieldErrors[`partData.${field}`]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kompatybilność*</label>
                        <textarea
                            name="compatibility"
                            value={partData.compatibility || ''}
                            onChange={handlePartDataChange}
                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 text-gray-900 bg-white ${
                                fieldErrors['partData.compatibility'] ? 'border-red-500' : 'border-gray-300'
                            }`}
                            required
                        />
                        {fieldErrors['partData.compatibility'] && (
                            <p className="mt-1 text-sm text-red-600">{fieldErrors['partData.compatibility']}</p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    const getFieldLabel = (field: string): string => {
        const labels: Record<string, string> = {
            brand: 'Marka',
            model: 'Model',
            year: 'Rok produkcji',
            bodyType: 'Typ nadwozia',
            color: 'Kolor',
            engine: 'Silnik',
            fuelType: 'Rodzaj paliwa',
            transmission: 'Skrzynia biegów',
            drive: 'Napęd',
            mileage: 'Przebieg (km)',
            condition: 'Stan pojazdu',
            history: 'Historia pojazdu',
            equipment: 'Wyposażenie',
            formalities: 'Formalności',
            partName: 'Nazwa części',
            partNumber: 'Numer katalogowy',
            compatibility: 'Kompatybilność',
            engineVersion: 'Wersja silnika/nadwozia'
        };
        return labels[field] || field;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">Dodaj nowe ogłoszenie</h1>
                    
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                            <p>{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-lg font-medium text-gray-700 mb-2">Kategoria ogłoszenia*</label>
                            <select
                                value={category}
                                onChange={handleCategoryChange}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
                                required
                            >
                                <option value="">-- Wybierz kategorię --</option>
                                <option value="Vehicle">Samochód</option>
                                <option value="Part">Część samochodowa</option>
                            </select>
                        </div>

                        {category && (
                            <>
                                <div className="space-y-6">
                                    <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Dane podstawowe</h2>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tytuł ogłoszenia*</label>
                                        <input 
                                            type="text" 
                                            value={title} 
                                            onChange={(e) => {
                                                setTitle(e.target.value);
                                                setFieldErrors(prev => ({ ...prev, title: '' }));
                                            }} 
                                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                                fieldErrors.title ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            maxLength={100}
                                        />
                                        {fieldErrors.title && <p className="mt-1 text-sm text-red-600">{fieldErrors.title}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Opis*</label>
                                        <textarea 
                                            value={description} 
                                            onChange={(e) => {
                                                setDescription(e.target.value);
                                                setFieldErrors(prev => ({ ...prev, description: '' }));
                                            }} 
                                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32 text-gray-900 bg-white ${
                                                fieldErrors.description ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            maxLength={2000}
                                        />
                                        {fieldErrors.description && <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cena (PLN)*</label>
                                            <input 
                                                type="number" 
                                                value={price} 
                                                onChange={(e) => {
                                                    setPrice(e.target.value);
                                                    setFieldErrors(prev => ({ ...prev, price: '' }));
                                                }} 
                                                min="0.01"
                                                step="0.01"
                                                className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                                    fieldErrors.price ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            />
                                            {fieldErrors.price && <p className="mt-1 text-sm text-red-600">{fieldErrors.price}</p>}
                                        </div>
                                        <div className="flex items-center mt-6">
                                            <input 
                                                type="checkbox" 
                                                id="negotiable" 
                                                checked={isNegotiable} 
                                                onChange={(e) => setIsNegotiable(e.target.checked)} 
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                                            />
                                            <label htmlFor="negotiable" className="ml-2 block text-sm text-gray-700">Cena do negocjacji</label>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Numer telefonu*</label>
                                        <input 
                                            type="tel" 
                                            value={phoneNumber} 
                                            onChange={(e) => {
                                                setPhoneNumber(e.target.value);
                                                setFieldErrors(prev => ({ ...prev, phoneNumber: '' }));
                                            }} 
                                            className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white ${
                                                fieldErrors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                            maxLength={15}
                                        />
                                        {fieldErrors.phoneNumber && <p className="mt-1 text-sm text-red-600">{fieldErrors.phoneNumber}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferowany kontakt*</label>
                                        <div className="flex flex-wrap gap-4">
                                            {['Telefon', 'Email'].map(pref => (
                                                <div key={pref} className="flex items-center">
                                                    <input 
                                                        type="radio" 
                                                        id={`contact-${pref}`} 
                                                        name="contactPreference" 
                                                        value={pref} 
                                                        checked={contactPreference === pref} 
                                                        onChange={(e) => {
                                                            setContactPreference(e.target.value);
                                                            setFieldErrors(prev => ({ ...prev, contactPreference: '' }));
                                                        }} 
                                                        className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" 
                                                        required
                                                    />
                                                    <label htmlFor={`contact-${pref}`} className="ml-2 block text-sm text-gray-700">{pref}</label>
                                                </div>
                                            ))}
                                        </div>
                                        {fieldErrors.contactPreference && (
                                            <p className="mt-1 text-sm text-red-600">{fieldErrors.contactPreference}</p>
                                        )}
                                    </div>

                                    {renderCategorySpecificFields()}

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Przetwarzanie...
                                                </span>
                                            ) : 'Dodaj ogłoszenie'}
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAnnouncementPage;