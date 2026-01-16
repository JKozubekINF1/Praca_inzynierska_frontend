import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { CreateAnnouncementDto, VehicleDetails, PartDetails } from '../types';
import { announcementService } from '../services/announcementService';

export const useAnnouncementForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [category, setCategory] = useState<'Pojazd' | 'Część' | ''>('');
  const [baseData, setBaseData] = useState({
    title: '',
    description: '',
    price: '',
    phoneNumber: '',
    contactPreference: 'Telefon',
    location: '',
  });

  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

  const [photos, setPhotos] = useState<File[]>([]);
  const [features, setFeatures] = useState<string[]>([]);

  const [vehicleData, setVehicleData] = useState<Omit<VehicleDetails, 'id'>>({
    brand: '',
    model: '',
    generation: '',
    year: new Date().getFullYear(),
    mileage: 0,
    enginePower: 0,
    engineCapacity: 0,
    fuelType: 'Benzyna',
    gearbox: 'Manualna',
    bodyType: 'Sedan',
    driveType: 'FWD',
    color: '',
    vin: '',
    state: 'Używany',
  });
  const [partData, setPartData] = useState<Omit<PartDetails, 'id'>>({
    partName: '',
    partNumber: '',
    compatibility: '',
    state: 'Używany',
  });

  const handleBaseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setBaseData({ ...baseData, [e.target.name]: e.target.value });
  };

  const handleLocationBlur = async () => {
    if (!baseData.location || baseData.location.length < 3) return;

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          baseData.location
        )}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setCoords({ lat, lng });
        toast.success('Znaleziono lokalizację na mapie!');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleMapClick = async (lat: number, lng: number) => {
    setCoords({ lat, lng });

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();

      if (data && data.display_name) {
        let shortAddress =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.display_name.split(',')[0];
        if (data.address.road) shortAddress = `${data.address.road}, ${shortAddress}`;

        setBaseData((prev) => ({ ...prev, location: shortAddress || data.display_name }));
      }
    } catch (error) {
      console.error('Reverse Geocoding error:', error);
    }
  };

  const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
  };
  const handlePartChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setPartData({ ...partData, [e.target.name]: e.target.value });
  };
  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setPhotos(Array.from(e.target.files));
  };
  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };
  const toggleFeature = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!baseData.title.trim()) errors.title = 'Tytuł jest wymagany';
    if (!baseData.price || Number(baseData.price) <= 0) errors.price = 'Cena musi być > 0';
    if (Object.keys(errors).length > 0) {
      toast.error('Popraw błędy w formularzu.');
      setFieldErrors(errors);
      return false;
    }
    setFieldErrors({});
    return true;
  };

  const buildDto = (): CreateAnnouncementDto => ({
    ...baseData,
    price: Number(baseData.price),
    category,
    features,
    latitude: coords?.lat,
    longitude: coords?.lng,
    vehicleDetails: category === 'Pojazd' ? vehicleData : undefined,
    partDetails: category === 'Część' ? partData : undefined,
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const toastId = toast.loading('Dodawanie ogłoszenia...');
    try {
      await announcementService.create(buildDto(), photos);
      toast.success('Sukces! Ogłoszenie dodane.', { id: toastId });
      navigate('/search');
    } catch (err: any) {
      toast.dismiss(toastId);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const toastId = toast.loading('Zapisywanie zmian...');
    try {
      await announcementService.update(id, buildDto(), photos);
      toast.success('Zmiany zapisane!', { id: toastId });
      navigate(`/announcements/${id}`);
    } catch (err: any) {
      toast.dismiss(toastId);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err.response?.data?.errors) {
      const newErrors: Record<string, string> = {};
      const backendErrors = err.response.data.errors;
      Object.keys(backendErrors).forEach((key) => {
        newErrors[key.toLowerCase()] = backendErrors[key][0];
      });
      setFieldErrors(newErrors);
      toast.error('Formularz zawiera błędy walidacji.');
    } else {
      const msg = err.response?.data?.message || 'Wystąpił błąd serwera.';
      toast.error(msg);
      setGlobalError(msg);
    }
  };

  return {
    category,
    setCategory,
    baseData,
    setBaseData,
    vehicleData,
    setVehicleData,
    partData,
    setPartData,
    photos,
    setPhotos,
    features,
    setFeatures,
    coords,
    setCoords,
    loading,
    globalError,
    fieldErrors,
    handleBaseChange,
    handleVehicleChange,
    handlePartChange,
    handlePhotosChange,
    removePhoto,
    toggleFeature,
    submit,
    submitEdit,
    handleLocationBlur,
    handleMapClick,
  };
};
