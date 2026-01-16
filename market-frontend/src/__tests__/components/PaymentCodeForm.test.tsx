import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PaymentCodeForm } from '../../components/common/PaymentCodeForm';
import { transactionService } from '../../services/transactionservice';

vi.mock('../../services/transactionservice', () => ({
  transactionService: {
    topUp: vi.fn(),
  },
}));

describe('PaymentCodeForm', () => {
  const mockSuccess = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderuje formularz i kwotę', () => {
    render(<PaymentCodeForm amount={50} onSuccess={mockSuccess} onCancel={mockCancel} />);
    expect(screen.getByText('50.00 PLN')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('000000')).toBeInTheDocument();
  });

  it('pozwala wpisywać tylko cyfry', () => {
    render(<PaymentCodeForm amount={50} onSuccess={mockSuccess} onCancel={mockCancel} />);
    const input = screen.getByPlaceholderText('000000') as HTMLInputElement;

    fireEvent.change(input, { target: { value: '12abc34' } });

    expect(input.value).toBe('1234');
  });

  it('przycisk jest zablokowany gdy kod jest za krótki', () => {
    render(<PaymentCodeForm amount={50} onSuccess={mockSuccess} onCancel={mockCancel} />);
    const button = screen.getByText('Zatwierdź wpłatę');
    const input = screen.getByPlaceholderText('000000');

    fireEvent.change(input, { target: { value: '12345' } });
    expect(button).toBeDisabled();

    fireEvent.change(input, { target: { value: '123456' } });
    expect(button).not.toBeDisabled();
  });

  it('obsługuje sukces płatności', async () => {
    (transactionService.topUp as any).mockResolvedValue(true);
    render(<PaymentCodeForm amount={50} onSuccess={mockSuccess} onCancel={mockCancel} />);

    const input = screen.getByPlaceholderText('000000');
    fireEvent.change(input, { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Zatwierdź wpłatę'));

    expect(screen.getByText('Autoryzacja w banku...')).toBeInTheDocument();

    await waitFor(
      () => {
        expect(transactionService.topUp).toHaveBeenCalledWith(50);
        expect(mockSuccess).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('obsługuje błąd płatności', async () => {
    (transactionService.topUp as any).mockRejectedValue(new Error('Fail'));
    render(<PaymentCodeForm amount={50} onSuccess={mockSuccess} onCancel={mockCancel} />);

    fireEvent.change(screen.getByPlaceholderText('000000'), { target: { value: '123456' } });
    fireEvent.click(screen.getByText('Zatwierdź wpłatę'));

    await waitFor(
      () => {
        expect(screen.getByText('Błąd płatności. Spróbuj ponownie.')).toBeInTheDocument();
        expect(mockSuccess).not.toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });
});
