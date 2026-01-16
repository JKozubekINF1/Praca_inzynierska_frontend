import { useState, useEffect, useCallback } from 'react';
import { transactionService, type OrderData } from '../services/transactionservice';

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    try {
      const bal = await transactionService.getBalance();
      setBalance(bal);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const topUp = async (amount: number) => {
    setLoading(true);
    setError(null);
    try {
      await transactionService.topUp(amount);
      await fetchBalance();
    } catch (err: any) {
      setError(err.response?.status === 401 ? 'Sesja wygasła.' : 'Błąd transakcji.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buy = async (data: OrderData) => {
    setLoading(true);
    setError(null);
    try {
      await transactionService.buyItem(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Błąd zakupu.';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, fetchBalance, topUp, buy };
};
