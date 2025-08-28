import { useState, useEffect } from 'react';
import { CryptoCurrency } from '@/types/crypto';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export interface CryptoDetailData {
  id: string;
  symbol: string;
  name: string;
  image: { large: string };
  description: { en: string };
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    high_24h: { usd: number };
    low_24h: { usd: number };
    ath: { usd: number };
    atl: { usd: number };
    circulating_supply: number;
    max_supply: number;
  };
  market_cap_rank: number;
}

export const useCryptoDetail = (id: string) => {
  const [crypto, setCrypto] = useState<CryptoDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCryptoDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${COINGECKO_API}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch crypto details');
      }
      
      const data = await response.json();
      setCrypto(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCryptoDetail();
    }
  }, [id]);

  return {
    crypto,
    loading,
    error,
    refetch: fetchCryptoDetail
  };
};