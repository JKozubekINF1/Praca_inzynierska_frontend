import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatWindow from '../../components/chat/ChatWindow';
import { chatService } from '../../services/chatService';

vi.mock('../../services/chatService', () => ({
  chatService: {
    subscribeToChat: vi.fn(),
    sendMessage: vi.fn(),
    markMessagesAsRead: vi.fn(),
  },
}));

window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('ChatWindow', () => {
  const mockClose = vi.fn();
  const currentUser = { id: 1, username: 'Ja' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje wiadomości', () => {
    const messages = [
      { id: '1', text: 'Cześć', senderId: 2, timestamp: Date.now(), isRead: false },
      { id: '2', text: 'Witam', senderId: 1, timestamp: Date.now(), isRead: true },
    ];

    (chatService.subscribeToChat as any).mockImplementation((_: any, callback: any) => {
      callback(messages);
      return () => {};
    });

    render(
      <ChatWindow
        roomId="room1"
        currentUser={currentUser}
        otherUserName="Sprzedawca"
        onClose={mockClose}
      />
    );

    expect(screen.getByText('Sprzedawca')).toBeInTheDocument();
    expect(screen.getByText('Cześć')).toBeInTheDocument();
    expect(screen.getByText('Witam')).toBeInTheDocument();
  });

  it('wysyła wiadomość', async () => {
    (chatService.subscribeToChat as any).mockImplementation(() => () => {});

    render(
      <ChatWindow
        roomId="room1"
        currentUser={currentUser}
        otherUserName="Sprzedawca"
        onClose={mockClose}
      />
    );

    const input = screen.getByPlaceholderText('Napisz wiadomość...');
    fireEvent.change(input, { target: { value: 'Nowa wiadomość' } });
    const form = input.closest('form');
    if (form) fireEvent.submit(form);

    await waitFor(() => {
      expect(chatService.sendMessage).toHaveBeenCalledWith('room1', 1, 'Ja', 'Nowa wiadomość');
    });

    expect(input).toHaveValue('');
  });

  it('zamyka okno', () => {
    (chatService.subscribeToChat as any).mockImplementation(() => () => {});
    render(
      <ChatWindow
        roomId="room1"
        currentUser={currentUser}
        otherUserName="Sprzedawca"
        onClose={mockClose}
      />
    );

    fireEvent.click(screen.getByText('×'));
    expect(mockClose).toHaveBeenCalled();
  });
});
