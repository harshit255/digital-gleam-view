import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CryptoCurrency } from '@/types/crypto';

interface CryptoCardProps {
  crypto: CryptoCurrency;
}

export const CryptoCard = ({ crypto }: CryptoCardProps) => {
  const isPositive = crypto.price_change_percentage_24h > 0;
  const changeColor = isPositive ? 'text-success' : 'text-destructive';
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    }
    if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    }
    if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toLocaleString()}`;
  };

  return (
    <Card className="group bg-gradient-card backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-card-hover hover:scale-[1.02] cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={crypto.image}
              alt={crypto.name}
              className="w-10 h-10 rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                {crypto.name}
              </h3>
              <p className="text-sm text-muted-foreground uppercase">
                {crypto.symbol}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-foreground">
              {formatPrice(crypto.current_price)}
            </div>
            <div className={`flex items-center text-sm font-medium ${changeColor}`}>
              <TrendIcon className="w-4 h-4 mr-1" />
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Market Cap</span>
            <span className="font-medium text-foreground">
              {formatMarketCap(crypto.market_cap)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">24h Volume</span>
            <span className="font-medium text-foreground">
              {formatMarketCap(crypto.total_volume)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rank</span>
            <span className="font-medium text-primary">
              #{crypto.market_cap_rank}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};