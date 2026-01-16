import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnnouncementCard } from '../../components/common/AnnouncementCard';

vi.mock('../../components/common/FavoriteButton', () => ({
  FavoriteButton: () => <button data-testid="fav-btn">Ulubione</button>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../config', () => ({
  API_BASE_URL: 'http://test-api.com',
}));

const baseAnnouncement = {
  id: 123,
  title: 'Testowe BMW',
  category: 'Pojazd',
  location: 'Warszawa',
  price: 50000,
  createdAt: '2024-01-01',
  isActive: true,
  features: [],
  photos: [],
  userId: 1,
  user: { username: 'testuser', email: 'test@test.com' },
};

describe('AnnouncementCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje podstawowe informacje', () => {
    render(<AnnouncementCard announcement={baseAnnouncement} />);
    expect(screen.getByText('Testowe BMW')).toBeInTheDocument();
    expect(screen.getByText(/Warszawa/)).toBeInTheDocument();
    expect(screen.getByText(/50\s?000/)).toBeInTheDocument();
  });

  it('obsługuje nawigację', () => {
    render(<AnnouncementCard announcement={baseAnnouncement} />);
    fireEvent.click(screen.getByText('Testowe BMW'));
    expect(mockNavigate).toHaveBeenCalledWith('/announcements/123');
  });

  it('używa objectID dla Algolii', () => {
    render(
      <AnnouncementCard announcement={{ ...baseAnnouncement, id: undefined, objectID: '999' }} />
    );
    fireEvent.click(screen.getByText('Testowe BMW'));
    expect(mockNavigate).toHaveBeenCalledWith('/announcements/999');
  });

  it('obsługuje URL zdjęć', () => {
    const { unmount } = render(
      <AnnouncementCard
        announcement={{ ...baseAnnouncement, photoUrl: 'https://ext.com/img.jpg' }}
      />
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', 'https://ext.com/img.jpg');
    unmount();

    render(<AnnouncementCard announcement={{ ...baseAnnouncement, photoUrl: '/local.jpg' }} />);
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://test-api.com/local.jpg');
  });

  it('pokazuje placeholder przy braku zdjęcia', () => {
    render(<AnnouncementCard announcement={{ ...baseAnnouncement, photoUrl: undefined }} />);
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://placehold.co/600x400?text=Brak+Zdjecia'
    );
  });
});
