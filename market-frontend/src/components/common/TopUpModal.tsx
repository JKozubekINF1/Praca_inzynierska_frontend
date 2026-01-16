import React, { useState } from 'react';
import { PaymentCodeForm } from './PaymentCodeForm';

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TopUpModal: React.FC<TopUpModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [amountStr, setAmountStr] = useState('50');
  const [showPayment, setShowPayment] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    setAmountStr('50');
    setShowPayment(false);
    onClose();
  };

  const handleAmountSubmit = () => {
    if (parseFloat(amountStr) > 0) setShowPayment(true);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black bg-opacity-70 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl leading-none"
        >
          &times;
        </button>
        <h3 className="text-xl font-bold mb-6 text-center">Doładuj Portfel</h3>

        {showPayment ? (
          <PaymentCodeForm
            amount={parseFloat(amountStr)}
            onSuccess={() => {
              onSuccess();
              handleClose();
            }}
            onCancel={() => setShowPayment(false)}
          />
        ) : (
          <div>
            <input
              type="number"
              min="1"
              step="0.01"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="w-full text-2xl font-bold border-b-2 border-gray-300 focus:border-blue-600 outline-none py-2 text-center mb-6"
              autoFocus
            />
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[50, 100, 200].map((val) => (
                <button
                  key={val}
                  onClick={() => setAmountStr(val.toString())}
                  className="bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-2 text-sm font-medium"
                >
                  {val} zł
                </button>
              ))}
            </div>
            <button
              onClick={handleAmountSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition"
            >
              Dalej
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default TopUpModal;
