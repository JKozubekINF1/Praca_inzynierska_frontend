import React, { useState } from 'react';
import { transactionService } from '../../services/transactionservice';

interface PaymentCodeFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentCodeForm: React.FC<PaymentCodeFormProps> = ({
  amount,
  onSuccess,
  onCancel,
}) => {
  const [code, setCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);
    setTimeout(async () => {
      try {
        await transactionService.topUp(amount);
        onSuccess();
      } catch (err) {
        setError('Błąd płatności. Spróbuj ponownie.');
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (isProcessing) {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="font-bold text-gray-700">Autoryzacja w banku...</p>
        <p className="text-sm text-gray-500">Potwierdź w aplikacji mobilnej</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="mb-4 text-center text-gray-600">
        Kwota do zapłaty:{' '}
        <span className="font-bold text-black text-lg">{amount.toFixed(2)} PLN</span>
      </p>

      <div className="mb-6">
        <label className="block text-xs font-bold uppercase text-gray-500 mb-1 text-center">
          Kod płatności (6 cyfr)
        </label>
        <input
          type="text"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
          className="w-full text-center text-3xl tracking-[0.3em] font-mono border-2 border-gray-200 focus:border-blue-600 rounded-xl p-3 outline-none transition"
          placeholder="000000"
          autoFocus
        />
        <p className="text-xs text-center text-gray-400 mt-2">Wpisz kod z aplikacji bankowej</p>
        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
      </div>

      <button
        onClick={handleSubmit}
        disabled={code.length < 6}
        className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 disabled:opacity-50 transition"
      >
        Zatwierdź wpłatę
      </button>
      <button
        onClick={onCancel}
        className="w-full mt-2 text-sm text-gray-500 py-2 hover:text-black"
      >
        Anuluj
      </button>
    </div>
  );
};
