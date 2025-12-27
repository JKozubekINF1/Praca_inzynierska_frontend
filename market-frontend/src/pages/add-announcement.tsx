import React from 'react';
import { useAnnouncementForm } from '../hooks/useAnnouncementForm';
import { PhotoUploader } from '../components/add-announcement/PhotoUploader';
import { PREDEFINED_FEATURES } from '../constants';

const AddAnnouncementPage: React.FC = () => {
    const {
        category, setCategory, baseData, vehicleData, partData, photos, features,
        loading, globalError, fieldErrors,
        handleBaseChange, handleVehicleChange, handlePartChange, 
        handlePhotosChange, removePhoto, toggleFeature, submit
    } = useAnnouncementForm();

    const inputClass = "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black";
    const labelClass = "block text-sm font-bold text-black mb-1";
    const errorClass = "text-red-500 text-sm mt-1";

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200">
                <h1 className="text-3xl font-extrabold text-black mb-8 text-center">Wystaw przedmiot</h1>

                {globalError && <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold">{globalError}</div>}

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <label className="text-xl font-bold text-black mb-2 block">Kategoria*</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value as any)} 
                            className={inputClass}
                        >
                            <option value="">-- Wybierz kategorię --</option>
                            <option value="Pojazd">Samochód osobowy</option>
                            <option value="Część">Część samochodowa</option>
                        </select>
                    </div>

                    {category && (
                        <div className="animate-fade-in">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold border-b pb-2">Informacje podstawowe</h3>
                                <div>
                                    <label className={labelClass}>Tytuł*</label>
                                    <input name="title" value={baseData.title} onChange={handleBaseChange} className={inputClass} maxLength={100} />
                                    {fieldErrors.title && <p className={errorClass}>{fieldErrors.title}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Cena (PLN)*</label>
                                        <input type="number" name="price" value={baseData.price} onChange={handleBaseChange} className={inputClass} min="0" step="0.01" />
                                        {fieldErrors.price && <p className={errorClass}>{fieldErrors.price}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Lokalizacja*</label>
                                        <input name="location" value={baseData.location} onChange={handleBaseChange} className={inputClass} />
                                        {fieldErrors.location && <p className={errorClass}>{fieldErrors.location}</p>}
                                    </div>
                                </div>
                            </div>
                            <PhotoUploader photos={photos} onChange={handlePhotosChange} onRemove={removePhoto} />
                            {category === "Pojazd" && (
                                <div className="mt-6 border-t pt-6">
                                    <h3 className="text-xl font-bold border-b pb-2 mb-4">Dane pojazdu</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className={labelClass}>Marka*</label>
                                            <input name="brand" value={vehicleData.brand} onChange={handleVehicleChange} className={inputClass} placeholder="np. Audi" />
                                            {fieldErrors['vehicleDetails.brand'] && <p className={errorClass}>Wymagane</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Model*</label>
                                            <input name="model" value={vehicleData.model} onChange={handleVehicleChange} className={inputClass} placeholder="np. A4" />
                                            {fieldErrors['vehicleDetails.model'] && <p className={errorClass}>Wymagane</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Generacja</label>
                                            <input name="generation" value={vehicleData.generation} onChange={handleVehicleChange} className={inputClass} placeholder="np. B8" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Rok produkcji</label>
                                            <input type="number" name="year" value={vehicleData.year} onChange={handleVehicleChange} className={inputClass} min="1900" max={new Date().getFullYear() + 1} />
                                            {fieldErrors['vehicleDetails.year'] && <p className={errorClass}>Błędny rok</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Przebieg (km)</label>
                                            <input type="number" name="mileage" value={vehicleData.mileage} onChange={handleVehicleChange} className={inputClass} min="0" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>VIN</label>
                                            <input name="vin" value={vehicleData.vin} onChange={handleVehicleChange} className={inputClass} maxLength={17} />
                                            {fieldErrors['vehicleDetails.vin'] && <p className={errorClass}>Wymagane</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Pojemność (cm³)</label>
                                            <input type="number" name="engineCapacity" value={vehicleData.engineCapacity} onChange={handleVehicleChange} className={inputClass} min="0" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Moc (KM)</label>
                                            <input type="number" name="enginePower" value={vehicleData.enginePower} onChange={handleVehicleChange} className={inputClass} min="0" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Paliwo</label>
                                            <select name="fuelType" value={vehicleData.fuelType} onChange={handleVehicleChange} className={inputClass}>
                                                <option>Benzyna</option><option>Diesel</option><option>LPG</option><option>Hybryda</option><option>Elektryczny</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Skrzynia biegów</label>
                                            <select name="gearbox" value={vehicleData.gearbox} onChange={handleVehicleChange} className={inputClass}>
                                                <option>Manualna</option><option>Automatyczna</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Napęd</label>
                                            <select name="driveType" value={vehicleData.driveType} onChange={handleVehicleChange} className={inputClass}>
                                                <option>FWD</option><option>RWD</option><option>AWD/4x4</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Nadwozie</label>
                                            <select name="bodyType" value={vehicleData.bodyType} onChange={handleVehicleChange} className={inputClass}>
                                                <option>Sedan</option><option>Kombi</option><option>Hatchback</option><option>SUV</option><option>Coupe</option><option>Kabriolet</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className={labelClass}>Kolor</label>
                                            <input name="color" value={vehicleData.color} onChange={handleVehicleChange} className={inputClass} />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Stan</label>
                                            <select name="state" value={vehicleData.state} onChange={handleVehicleChange} className={inputClass}>
                                                <option>Używany</option><option>Nowy</option><option>Uszkodzony</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-8">
                                        <h4 className="font-bold text-lg mb-3">Wyposażenie dodatkowe</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg">
                                            {PREDEFINED_FEATURES.map(f => (
                                                <label key={f} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded transition">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={features.includes(f)} 
                                                        onChange={() => toggleFeature(f)} 
                                                        className="rounded text-blue-600 w-5 h-5 border-gray-300 focus:ring-blue-500" 
                                                    />
                                                    <span className="text-gray-800">{f}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {category === "Część" && (
                                <div className="mt-6 border-t pt-6">
                                    <h3 className="text-xl font-bold border-b pb-2 mb-4">Dane części</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className={labelClass}>Nazwa części*</label>
                                            <input name="partName" value={partData.partName} onChange={handlePartChange} className={inputClass} placeholder="np. Alternator" />
                                            {fieldErrors['partDetails.partName'] && <p className={errorClass}>Wymagane</p>}
                                        </div>
                                        <div>
                                            <label className={labelClass}>Numer katalogowy</label>
                                            <input name="partNumber" value={partData.partNumber} onChange={handlePartChange} className={inputClass} placeholder="np. 8K0..." />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className={labelClass}>Pasuje do (Kompatybilność)</label>
                                            <input name="compatibility" value={partData.compatibility} onChange={handlePartChange} className={inputClass} placeholder="np. Audi A4 B8, VW Passat B6" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Stan</label>
                                            <select name="state" value={partData.state} onChange={handlePartChange} className={inputClass}>
                                                <option>Używany</option><option>Nowy</option><option>Regenerowany</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="space-y-4 border-t pt-6 mt-6">
                                <h3 className="text-xl font-bold border-b pb-2">Opis i Kontakt</h3>
                                <div>
                                    <label className={labelClass}>Opis przedmiotu*</label>
                                    <textarea 
                                        name="description" 
                                        value={baseData.description} 
                                        onChange={handleBaseChange} 
                                        className={`${inputClass} h-40 resize-y`} 
                                        placeholder="Opisz dokładnie swój przedmiot..." 
                                        maxLength={2000}
                                    />
                                    {fieldErrors.description && <p className={errorClass}>{fieldErrors.description}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Telefon*</label>
                                        <input name="phoneNumber" value={baseData.phoneNumber} onChange={handleBaseChange} className={inputClass} placeholder="np. 500 100 200" />
                                        {fieldErrors.phoneNumber && <p className={errorClass}>{fieldErrors.phoneNumber}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>Preferencja kontaktu</label>
                                        <select name="contactPreference" value={baseData.contactPreference} onChange={handleBaseChange} className={inputClass}>
                                            <option>Telefon</option><option>Email</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 pb-4">
                                <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition shadow-lg text-lg tracking-wide">
                                    {loading ? 'Wysyłanie...' : 'DODAJ OGŁOSZENIE'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddAnnouncementPage;