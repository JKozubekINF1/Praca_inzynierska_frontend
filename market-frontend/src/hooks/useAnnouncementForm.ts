import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateAnnouncementDto, VehicleDetails, PartDetails } from '../types';
import { announcementService } from '../services/announcementService';

export const useAnnouncementForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [category, setCategory] = useState<"Pojazd" | "Część" | "">("");
    const [baseData, setBaseData] = useState({
        title: '', description: '', price: '', phoneNumber: '', contactPreference: 'Telefon', location: ''
    });
    const [photos, setPhotos] = useState<File[]>([]);
    const [features, setFeatures] = useState<string[]>([]);
    const [vehicleData, setVehicleData] = useState<Omit<VehicleDetails, 'id'>>({
        brand: '', model: '', generation: '', year: new Date().getFullYear(),
        mileage: 0, enginePower: 0, engineCapacity: 0,
        fuelType: 'Benzyna', gearbox: 'Manualna', bodyType: 'Sedan',
        driveType: 'FWD', color: '', vin: '', state: 'Używany'
    });


    const [partData, setPartData] = useState<Omit<PartDetails, 'id'>>({
        partName: '', partNumber: '', compatibility: '', state: 'Używany'
    });

    const handleBaseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setBaseData({ ...baseData, [e.target.name]: e.target.value });
    };

    const handleVehicleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setVehicleData({ ...vehicleData, [e.target.name]: e.target.value });
    };

    const handlePartChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setPartData({ ...partData, [e.target.name]: e.target.value });
    };

    const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setPhotos(Array.from(e.target.files));
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const toggleFeature = (feature: string) => {
        setFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!baseData.title.trim()) errors.title = 'Tytuł jest wymagany';
        if (!baseData.price || Number(baseData.price) <= 0) errors.price = 'Cena musi być > 0';
        if (category === "Pojazd") {
            if (!vehicleData.brand) errors['vehicleDetails.brand'] = 'Marka wymagana';
            if (!vehicleData.model) errors['vehicleDetails.model'] = 'Model wymagany';
        }
        if (category === "Część" && !partData.partName) errors['partDetails.partName'] = 'Nazwa wymagana';
        
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        
        setLoading(true);
        setGlobalError(null);

        const dto: CreateAnnouncementDto = {
            ...baseData,
            price: Number(baseData.price),
            category,
            features,
            vehicleDetails: category === 'Pojazd' ? vehicleData : undefined,
            partDetails: category === 'Część' ? partData : undefined,
        };

        try {
            await announcementService.create(dto, photos);
            navigate('/search', { state: { successMessage: 'Ogłoszenie dodane!' } });
        } catch (err: any) {
            console.error(err);
            if (err.response?.data?.errors) {
                const newErrors: Record<string, string> = {};
                const backendErrors = err.response.data.errors;
                Object.keys(backendErrors).forEach(key => {
                    newErrors[key.toLowerCase()] = backendErrors[key][0];
                });
                setFieldErrors(newErrors);
            } else {
                setGlobalError("Wystąpił błąd serwera.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        category, baseData, vehicleData, partData, photos, features, loading, globalError, fieldErrors,
        handleBaseChange, handleVehicleChange, handlePartChange, handlePhotosChange, removePhoto, toggleFeature, submit, setCategory
    };
};