import React from 'react';
import { useAnnouncementForm } from '../hooks/useAnnouncementForm';
import { AnnouncementForm } from '../components/common/AnnouncementForm';

const AddAnnouncementPage: React.FC = () => {
  const formLogic = useAnnouncementForm();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <AnnouncementForm
        form={formLogic}
        title="Dodaj ogłoszenie"
        submitLabel="DODAJ OGŁOSZENIE"
        onSubmit={formLogic.submit}
      />
    </div>
  );
};

export default AddAnnouncementPage;
