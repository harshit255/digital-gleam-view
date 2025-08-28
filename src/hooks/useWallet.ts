import { useState, useEffect } from 'react';

export interface WalletHolding {
  id: string;
  symbol: string;
  name: string;
  amount: number;
  averagePrice: number;
  currentPrice: number;
  image: string;
}

export const useWallet = () => {
  const [holdings, setHoldings] = useState<WalletHolding[]>([]);
  const [totalValue, setTotalValue] = useState(0);

  // Load wallet data from localStorage
  useEffect(() => {
    const savedWallet = localStorage.getItem('cryptoWallet');
    if (savedWallet) {
      const parsedWallet = JSON.parse(savedWallet);
      setHoldings(parsedWallet);
      calculateTotalValue(parsedWallet);
    }
  }, []);

  const calculateTotalValue = (walletHoldings: WalletHolding[]) => {
    const total = walletHoldings.reduce((sum, holding) => {
      return sum + (holding.amount * holding.currentPrice);
    }, 0);
    setTotalValue(total);
  };

  const addHolding = (crypto: any, amount: number, price: number) => {
    const existingIndex = holdings.findIndex(h => h.id === crypto.id);
    let newHoldings;

    if (existingIndex >= 0) {
      // Update existing holding
      newHoldings = [...holdings];
      const existing = newHoldings[existingIndex];
      const totalAmount = existing.amount + amount;
      const totalCost = (existing.amount * existing.averagePrice) + (amount * price);
      existing.amount = totalAmount;
      existing.averagePrice = totalCost / totalAmount;
      existing.currentPrice = price;
    } else {
      // Add new holding
      const newHolding: WalletHolding = {
        id: crypto.id,
        symbol: crypto.symbol,
        name: crypto.name,
        amount,
        averagePrice: price,
        currentPrice: price,
        image: crypto.image?.large || crypto.image || '/placeholder.svg'
      };
      newHoldings = [...holdings, newHolding];
    }

    setHoldings(newHoldings);
    localStorage.setItem('cryptoWallet', JSON.stringify(newHoldings));
    calculateTotalValue(newHoldings);
  };

  const removeHolding = (cryptoId: string, amount: number) => {
    const newHoldings = holdings.map(holding => {
      if (holding.id === cryptoId) {
        const newAmount = Math.max(0, holding.amount - amount);
        return { ...holding, amount: newAmount };
      }
      return holding;
    }).filter(holding => holding.amount > 0);

    setHoldings(newHoldings);
    localStorage.setItem('cryptoWallet', JSON.stringify(newHoldings));
    calculateTotalValue(newHoldings);
  };

  const updateCurrentPrices = async (cryptoIds: string[]) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd`
      );
      const data = await response.json();

      const updatedHoldings = holdings.map(holding => ({
        ...holding,
        currentPrice: data[holding.id]?.usd || holding.currentPrice
      }));

      setHoldings(updatedHoldings);
      localStorage.setItem('cryptoWallet', JSON.stringify(updatedHoldings));
      calculateTotalValue(updatedHoldings);
    } catch (error) {
      console.error('Failed to update prices:', error);
    }
  };

  return {
    holdings,
    totalValue,
    addHolding,
    removeHolding,
    updateCurrentPrices
  };
};