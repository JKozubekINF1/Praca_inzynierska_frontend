import React, { useState } from 'react';
import { PaymentCodeForm } from './PaymentCodeForm';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  priceToPay: number;
  onTopUpSuccess: () => Promise<void>;
  onPaymentConfirm: () => void;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  priceToPay,
  onTopUpSuccess,
  onPaymentConfirm,
}) => {
  const [showPayment, setShowPayment] = useState(false);

  const missingAmount = priceToPay - currentBalance;
  const canAfford = missingAmount <= 0;
  const amountToTopUp = missingAmount > 0 ? missingAmount : 10;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h3 className="text-xl font-bold">Podsumowanie Zakupu</h3>
          <button onClick={onClose} className="text-2xl leading-none">
            &times;
          </button>
        </div>

        {showPayment ? (
          <PaymentCodeForm
            amount={amountToTopUp}
            onSuccess={async () => {
              await onTopUpSuccess();
              setShowPayment(false);
            }}
            onCancel={() => setShowPayment(false)}
          />
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Cena:</span> <b>{priceToPay.toFixed(2)} PLN</b>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span>Twoje saldo:</span>
                <b className={canAfford ? 'text-green-600' : 'text-red-500'}>
                  {currentBalance.toFixed(2)} PLN
                </b>
              </div>
            </div>

            {canAfford ? (
              <button
                onClick={onPaymentConfirm}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:bg-green-700 transition"
              >
                POTWIERDZAM I PŁACĘ
              </button>
            ) : (
              <div>
                <p className="text-red-500 text-sm text-center mb-3">
                  Brakuje Ci {missingAmount.toFixed(2)} PLN
                </p>
                <button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-yellow-400 text-black py-3 rounded-xl font-bold hover:bg-yellow-500 transition flex items-center justify-center gap-2"
                >
                  <span>⚡</span> Doładuj natychmiast
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default WalletModal;
