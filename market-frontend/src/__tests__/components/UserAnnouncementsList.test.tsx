import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserAnnouncementsList } from '../../components/profile/UserAnnouncementsList';

const mockNavigate = vi.fn();
const mockActivate = vi.fn();
const mockRenew = vi.fn();
const mockDelete = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock('../../hooks/useUserAnnouncements', () => ({
  useUserAnnouncements: () => ({
    announcements: [
      {
        id: 1,
        title: 'Aktywne Auto',
        price: 50000,
        isActive: true,
        expiresAt: new Date(Date.now() + 86400000 * 10).toISOString(), // +10 dni
        category: 'Pojazd',
        location: 'Warszawa',
        photoUrl: 'img.jpg',
      },
      {
        id: 2,
        title: 'Wygasłe Auto',
        price: 10000,
        isActive: false,
        expiresAt: '2023-01-01',
        category: 'Pojazd',
        location: 'Kraków',
      },
    ],
    processingId: null,
    activateAnnouncement: mockActivate,
    renewAnnouncement: mockRenew,
    deleteAnnouncement: mockDelete,
  }),
}));

describe('UserAnnouncementsList', () => {
  it('renderuje listę ogłoszeń', () => {
    render(<UserAnnouncementsList />);
    expect(screen.getByText('Aktywne Auto')).toBeInTheDocument();
    expect(screen.getByText('Wygasłe Auto')).toBeInTheDocument();
  });

  it('oznacza wygasłe ogłoszenia', () => {
    render(<UserAnnouncementsList />);
    expect(screen.getByText('Wygasłe')).toBeInTheDocument();
    expect(screen.getByText('Aktywne')).toBeInTheDocument();
  });

  it('pozwala usunąć ogłoszenie', () => {
    render(<UserAnnouncementsList />);
    const deleteButtons = screen.getAllByText('Usuń');
    fireEvent.click(deleteButtons[0]);
    expect(mockDelete).toHaveBeenCalledWith(1);
  });

  it('pokazuje przycisk Aktywuj dla wygasłych', () => {
    render(<UserAnnouncementsList />);
    const activateBtn = screen.getByText('Aktywuj');
    fireEvent.click(activateBtn);
    expect(mockActivate).toHaveBeenCalledWith(2);
  });

  it('nawiguje do szczegółów po kliknięciu w kartę', () => {
    render(<UserAnnouncementsList />);
    fireEvent.click(screen.getByText('Aktywne Auto'));
    expect(mockNavigate).toHaveBeenCalledWith('/announcements/1');
  });
});
