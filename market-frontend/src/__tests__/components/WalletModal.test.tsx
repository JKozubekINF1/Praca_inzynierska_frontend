import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WalletModal from '../../components/common/WalletModal';

vi.mock('../../components/common/PaymentCodeForm', () => ({
  PaymentCodeForm: ({ amount, onSuccess }: any) => (
    <div>
      <p>Mock Payment Form: {amount}</p>
      <button onClick={onSuccess}>Symuluj Sukces</button>
    </div>
  ),
}));

describe('WalletModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    currentBalance: 0,
    priceToPay: 100,
    onTopUpSuccess: vi.fn(),
    onPaymentConfirm: vi.fn(),
  };

  it('nie renderuje się gdy isOpen jest false', () => {
    render(<WalletModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Podsumowanie Zakupu')).not.toBeInTheDocument();
  });

  it('pokazuje przycisk "Doładuj", gdy brakuje środków', () => {
    render(<WalletModal {...defaultProps} currentBalance={20} priceToPay={100} />);

    expect(screen.getByText(/Brakuje Ci 80.00 PLN/)).toBeInTheDocument();
    expect(screen.getByText('Doładuj natychmiast')).toBeInTheDocument();
    expect(screen.queryByText('POTWIERDZAM I PŁACĘ')).not.toBeInTheDocument();
  });

  it('pokazuje przycisk "Potwierdzam", gdy masz wystarczająco środków', () => {
    render(<WalletModal {...defaultProps} currentBalance={120} priceToPay={100} />);

    expect(screen.queryByText(/Brakuje Ci/)).not.toBeInTheDocument();
    expect(screen.getByText('POTWIERDZAM I PŁACĘ')).toBeInTheDocument();
  });

  it('przełącza na widok płatności po kliknięciu Doładuj', () => {
    render(<WalletModal {...defaultProps} currentBalance={0} priceToPay={50} />);

    fireEvent.click(screen.getByText('Doładuj natychmiast'));
    expect(screen.getByText('Mock Payment Form: 50')).toBeInTheDocument();
  });

  it('wywołuje onPaymentConfirm po kliknięciu Potwierdzam', () => {
    render(<WalletModal {...defaultProps} currentBalance={200} priceToPay={100} />);

    fireEvent.click(screen.getByText('POTWIERDZAM I PŁACĘ'));

    expect(defaultProps.onPaymentConfirm).toHaveBeenCalled();
  });
});
