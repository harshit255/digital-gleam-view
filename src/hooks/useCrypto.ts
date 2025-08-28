import { useState, useEffect } from 'react';
import { CryptoCurrency } from '@/types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export const useCrypto = () => {
  const [cryptos, setCryptos] = useState<CryptoCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto data');
      }
      
      const data = await response.json();
      setCryptos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptos();
    
    // Refresh data every 60 seconds
    const interval = setInterval(fetchCryptos, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const searchCryptos = (query: string) => {
    if (!query.trim()) return cryptos;
    
    return cryptos.filter(crypto =>
      crypto.name.toLowerCase().includes(query.toLowerCase()) ||
      crypto.symbol.toLowerCase().includes(query.toLowerCase())
    );
  };

  return {
    cryptos,
    loading,
    error,
    searchCryptos,
    refetch: fetchCryptos
  };
};