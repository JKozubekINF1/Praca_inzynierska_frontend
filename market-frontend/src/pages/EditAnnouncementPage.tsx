import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAnnouncementForm } from '../hooks/useAnnouncementForm';
import { announcementService } from '../services/announcementService';
import { AnnouncementForm } from '../components/common/AnnouncementForm';

const EditAnnouncementPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);

  const formLogic = useAnnouncementForm();
  const {
    setCategory,
    setBaseData,
    setVehicleData,
    setPartData,
    setFeatures,
    setCoords,
    submitEdit,
  } = formLogic;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const data = await announcementService.getById(id);

        setCategory(data.category as any);
        setBaseData({
          title: data.title,
          description: data.description,
          price: data.price.toString(),
          phoneNumber: data.phoneNumber,
          contactPreference: data.contactPreference,
          location: data.location,
        });

        if (data.latitude && data.longitude) {
          setCoords({ lat: data.latitude, lng: data.longitude });
        }

        if (data.features) {
          setFeatures(data.features.map((f: any) => f.featureName));
        }

        if (data.category === 'Pojazd' && data.vehicleDetails) {
          const { id: vId, ...rest } = data.vehicleDetails;
          setVehicleData(rest);
        }

        if (data.category === 'Część' && data.partDetails) {
          const { id: pId, ...rest } = data.partDetails;
          setPartData(rest);
        }
      } catch (err) {
        console.error(err);
        toast.error('Nie udało się pobrać danych ogłoszenia.');
        navigate('/profile');
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [id]);

  if (isFetching)
    return (
      <div className="flex justify-center items-center h-screen text-blue-600 font-bold text-xl">
        Ładowanie danych...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <AnnouncementForm
        form={formLogic}
        title="Edytuj ogłoszenie"
        submitLabel="ZAPISZ ZMIANY"
        onSubmit={(e) => submitEdit(e, Number(id))}
      />
    </div>
  );
};

export default EditAnnouncementPage;
