import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AnnouncementForm } from '../../components/common/AnnouncementForm';

vi.mock('../add-announcement/PhotoUploader', () => ({
  PhotoUploader: () => <div data-testid="photo-uploader">PhotoUploader</div>,
}));

vi.mock('../common/LocationPicker', () => ({
  default: () => <div data-testid="location-picker">LocationPicker</div>,
}));

vi.mock('../../constants', () => ({
  PREDEFINED_FEATURES: ['Klimatyzacja', 'Tempomat'],
}));

describe('AnnouncementForm', () => {
  const mockSubmit = vi.fn((e) => e.preventDefault());
  const mockSetCategory = vi.fn();
  const mockHandleBaseChange = vi.fn();

  const defaultFormProps: any = {
    category: '',
    setCategory: mockSetCategory,
    baseData: {
      title: '',
      description: '',
      price: '',
      phoneNumber: '',
      contactPreference: 'Telefon',
      location: '',
    },
    vehicleData: {
      brand: '',
      model: '',
      generation: '',
      year: 2024,
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
    },
    partData: {
      partName: '',
      partNumber: '',
      compatibility: '',
      state: 'Używany',
    },
    photos: [],
    features: [],
    coords: null,
    loading: false,
    globalError: null,
    fieldErrors: {},
    handleBaseChange: mockHandleBaseChange,
    handleVehicleChange: vi.fn(),
    handlePartChange: vi.fn(),
    handlePhotosChange: vi.fn(),
    removePhoto: vi.fn(),
    toggleFeature: vi.fn(),
    handleLocationBlur: vi.fn(),
    handleMapClick: vi.fn(),
  };

  it('renderuje stan początkowy', () => {
    render(
      <AnnouncementForm
        form={defaultFormProps}
        title="Dodaj"
        submitLabel="OK"
        onSubmit={mockSubmit}
      />
    );
    expect(screen.getByText('Dodaj')).toBeInTheDocument();
    expect(screen.queryByText('Informacje podstawowe')).not.toBeInTheDocument();
  });

  it('renderuje formularz pojazdu', () => {
    render(
      <AnnouncementForm
        form={{ ...defaultFormProps, category: 'Pojazd' }}
        title="Dodaj"
        submitLabel="OK"
        onSubmit={mockSubmit}
      />
    );
    expect(screen.getByText('Dane pojazdu')).toBeInTheDocument();
  });

  it('renderuje formularz części', () => {
    render(
      <AnnouncementForm
        form={{ ...defaultFormProps, category: 'Część' }}
        title="Dodaj"
        submitLabel="OK"
        onSubmit={mockSubmit}
      />
    );
    expect(screen.getByText('Dane części')).toBeInTheDocument();
  });

  it('wyświetla błędy walidacji', () => {
    render(
      <AnnouncementForm
        form={{ ...defaultFormProps, category: 'Pojazd', fieldErrors: { title: 'Błąd tytułu' } }}
        title="Dodaj"
        submitLabel="OK"
        onSubmit={mockSubmit}
      />
    );
    expect(screen.getByText('Błąd tytułu')).toBeInTheDocument();
  });

  it('wywołuje zmianę inputa', () => {
    render(
      <AnnouncementForm
        form={{ ...defaultFormProps, category: 'Pojazd' }}
        title="Dodaj"
        submitLabel="OK"
        onSubmit={mockSubmit}
      />
    );
    const input = screen.getByPlaceholderText('Np. BMW E46 320d');
    fireEvent.change(input, { target: { value: 'Test' } });
    expect(mockHandleBaseChange).toHaveBeenCalled();
  });

  it('blokuje submit podczas ładowania', () => {
    render(
      <AnnouncementForm
        form={{ ...defaultFormProps, category: 'Pojazd', loading: true }}
        title="Dodaj"
        submitLabel="OK"
        onSubmit={mockSubmit}
      />
    );
    expect(screen.getByRole('button', { name: 'Zapisywanie...' })).toBeDisabled();
  });
});
