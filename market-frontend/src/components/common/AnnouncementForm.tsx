import React from 'react';
import { PhotoUploader } from '../add-announcement/PhotoUploader';
import LocationPicker from '../common/LocationPicker';
import { PREDEFINED_FEATURES } from '../../constants';
import type { useAnnouncementForm } from '../../hooks/useAnnouncementForm';

interface AnnouncementFormProps {
  form: ReturnType<typeof useAnnouncementForm>;
  title: string;
  submitLabel: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  form,
  title,
  submitLabel,
  onSubmit,
}) => {
  const {
    category,
    setCategory,
    baseData,
    vehicleData,
    partData,
    photos,
    features,
    coords,
    loading,
    globalError,
    fieldErrors,
    handleBaseChange,
    handleVehicleChange,
    handlePartChange,
    handlePhotosChange,
    removePhoto,
    toggleFeature,
    handleLocationBlur,
    handleMapClick,
  } = form;

  const inputClass =
    'w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black';
  const labelClass = 'block text-sm font-bold text-black mb-1';
  const errorClass = 'text-red-500 text-sm mt-1';

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl p-8 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-black mb-8 text-center">{title}</h1>

      {globalError && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 font-bold">
          {globalError}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="text-xl font-bold text-black mb-2 block">Kategoria</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
            disabled={title.includes('Edytuj')}
            className={`${inputClass} ${
              title.includes('Edytuj') ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">-- Wybierz kategorię --</option>
            <option value="Pojazd">Samochód osobowy</option>
            <option value="Część">Część samochodowa</option>
          </select>
        </div>

        {category && (
          <>
            <div className="space-y-4">
              <h3 className="text-xl font-bold border-b pb-2">Informacje podstawowe</h3>
              <div>
                <label className={labelClass}>Tytuł*</label>
                <input
                  name="title"
                  value={baseData.title}
                  onChange={handleBaseChange}
                  className={inputClass}
                  maxLength={100}
                  placeholder="Np. BMW E46 320d"
                />
                {fieldErrors.title && <p className={errorClass}>{fieldErrors.title}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Cena (PLN)*</label>
                  <input
                    type="number"
                    name="price"
                    value={baseData.price}
                    onChange={handleBaseChange}
                    className={inputClass}
                    min="0"
                    step="0.01"
                  />
                  {fieldErrors.price && <p className={errorClass}>{fieldErrors.price}</p>}
                </div>

                <div>
                  <label className={labelClass}>Lokalizacja (adres)*</label>
                  <div className="flex gap-2">
                    <input
                      name="location"
                      value={baseData.location}
                      onChange={handleBaseChange}
                      onBlur={handleLocationBlur}
                      className={`${inputClass} flex-1`}
                      placeholder="Np. Warszawa, Złota 44"
                    />
                    <button
                      type="button"
                      onClick={handleLocationBlur}
                      className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center shadow-sm"
                      title="Znajdź na mapie"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                        />
                      </svg>
                    </button>
                  </div>
                  {fieldErrors.location && <p className={errorClass}>{fieldErrors.location}</p>}
                </div>
              </div>

              <div className="mt-4">
                <label className={labelClass}>Dokładna lokalizacja (kliknij na mapie)</label>
                <LocationPicker coords={coords} onLocationSelect={handleMapClick} />
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-sm text-blue-800 font-bold">
                {title.includes('Edytuj')
                  ? 'Uwaga: Dodanie nowych zdjęć zastąpi stare.'
                  : 'Dodaj zdjęcia (pierwsze będzie głównym)'}
              </p>
            </div>
            <PhotoUploader photos={photos} onChange={handlePhotosChange} onRemove={removePhoto} />

            {category === 'Pojazd' && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-xl font-bold border-b pb-2 mb-4">Dane pojazdu</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Marka</label>
                    <input
                      name="brand"
                      value={vehicleData.brand}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Model</label>
                    <input
                      name="model"
                      value={vehicleData.model}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Generacja</label>
                    <input
                      name="generation"
                      value={vehicleData.generation}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Rok</label>
                    <input
                      type="number"
                      name="year"
                      value={vehicleData.year}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Przebieg (km)</label>
                    <input
                      type="number"
                      name="mileage"
                      value={vehicleData.mileage}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Moc (KM)</label>
                    <input
                      type="number"
                      name="enginePower"
                      value={vehicleData.enginePower}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pojemność (cm3)</label>
                    <input
                      type="number"
                      name="engineCapacity"
                      value={vehicleData.engineCapacity}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Paliwo</label>
                    <select
                      name="fuelType"
                      value={vehicleData.fuelType}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    >
                      <option>Benzyna</option>
                      <option>Diesel</option>
                      <option>LPG</option>
                      <option>Hybryda</option>
                      <option>Elektryczny</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>VIN</label>
                    <input
                      name="vin"
                      value={vehicleData.vin}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Skrzynia biegów</label>
                    <select
                      name="gearbox"
                      value={vehicleData.gearbox}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    >
                      <option>Manualna</option>
                      <option>Automatyczna</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Napęd</label>
                    <select
                      name="driveType"
                      value={vehicleData.driveType}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    >
                      <option>FWD</option>
                      <option>RWD</option>
                      <option>AWD/4x4</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Nadwozie</label>
                    <select
                      name="bodyType"
                      value={vehicleData.bodyType}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    >
                      <option>Sedan</option>
                      <option>Kombi</option>
                      <option>Hatchback</option>
                      <option>SUV</option>
                      <option>Coupe</option>
                      <option>Kabriolet</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Kolor</label>
                    <input
                      name="color"
                      value={vehicleData.color}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stan</label>
                    <select
                      name="state"
                      value={vehicleData.state}
                      onChange={handleVehicleChange}
                      className={inputClass}
                    >
                      <option>Używany</option>
                      <option>Nowy</option>
                      <option>Uszkodzony</option>
                    </select>
                  </div>
                </div>

                <div className="mt-8">
                  <h4 className="font-bold text-lg mb-3">Wyposażenie</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg">
                    {PREDEFINED_FEATURES.map((f) => (
                      <label key={f} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={features.includes(f)}
                          onChange={() => toggleFeature(f)}
                          className="rounded w-5 h-5"
                        />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {category === 'Część' && (
              <div className="mt-6 border-t pt-6">
                <h3 className="text-xl font-bold border-b pb-2 mb-4">Dane części</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Nazwa części</label>
                    <input
                      name="partName"
                      value={partData.partName}
                      onChange={handlePartChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Numer katalogowy</label>
                    <input
                      name="partNumber"
                      value={partData.partNumber}
                      onChange={handlePartChange}
                      className={inputClass}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelClass}>Pasuje do</label>
                    <input
                      name="compatibility"
                      value={partData.compatibility}
                      onChange={handlePartChange}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Stan</label>
                    <select
                      name="state"
                      value={partData.state}
                      onChange={handlePartChange}
                      className={inputClass}
                    >
                      <option>Używany</option>
                      <option>Nowy</option>
                      <option>Regenerowany</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4 border-t pt-6 mt-6">
              <h3 className="text-xl font-bold border-b pb-2">Opis i Kontakt</h3>
              <div>
                <label className={labelClass}>Opis</label>
                <textarea
                  name="description"
                  value={baseData.description}
                  onChange={handleBaseChange}
                  className={`${inputClass} h-40`}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Telefon</label>
                  <input
                    name="phoneNumber"
                    value={baseData.phoneNumber}
                    onChange={handleBaseChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Preferencja kontaktu</label>
                  <select
                    name="contactPreference"
                    value={baseData.contactPreference}
                    onChange={handleBaseChange}
                    className={inputClass}
                  >
                    <option>Telefon</option>
                    <option>Email</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-8 pb-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg disabled:opacity-50 transition shadow-lg text-lg"
              >
                {loading ? 'Zapisywanie...' : submitLabel}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};
