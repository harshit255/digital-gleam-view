import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart3, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { PriceChart } from '@/components/PriceChart';
import { TradingPanel } from '@/components/TradingPanel';
import { useCryptoDetail } from '@/hooks/useCryptoDetail';

const CryptoDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { crypto, loading, error } = useCryptoDetail(id || '');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !crypto) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-lg mb-4">
            {error || 'Cryptocurrency not found'}
          </p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentPrice = crypto.market_data.current_price.usd;
  const change24h = crypto.market_data.price_change_percentage_24h;
  const change7d = crypto.market_data.price_change_percentage_7d;
  const change30d = crypto.market_data.price_change_percentage_30d;
  
  const isPositive24h = change24h > 0;
  const TrendIcon24h = isPositive24h ? TrendingUp : TrendingDown;
  const changeColor24h = isPositive24h ? 'text-success' : 'text-destructive';

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
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:bg-card/50"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-crypto rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                  CryptoTracker
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Crypto Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={crypto.image.large}
              alt={crypto.name}
              className="w-16 h-16 rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div>
              <h1 className="text-4xl font-bold text-foreground">{crypto.name}</h1>
              <p className="text-xl text-muted-foreground uppercase">{crypto.symbol}</p>
              <p className="text-sm text-muted-foreground">Rank #{crypto.market_cap_rank}</p>
            </div>
          </div>
          
          <div className="flex items-end space-x-4">
            <div className="text-5xl font-bold text-foreground">
              {formatPrice(currentPrice)}
            </div>
            <div className={`flex items-center text-lg font-medium ${changeColor24h}`}>
              <TrendIcon24h className="w-5 h-5 mr-1" />
              {Math.abs(change24h).toFixed(2)}% (24h)
            </div>
          </div>
        </div>

        {/* Price Changes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">24h Change</span>
                <div className={`flex items-center font-medium ${change24h > 0 ? 'text-success' : 'text-destructive'}`}>
                  {change24h > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(change24h).toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">7d Change</span>
                <div className={`flex items-center font-medium ${change7d > 0 ? 'text-success' : 'text-destructive'}`}>
                  {change7d > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(change7d).toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">30d Change</span>
                <div className={`flex items-center font-medium ${change30d > 0 ? 'text-success' : 'text-destructive'}`}>
                  {change30d > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(change30d).toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chart and Stats */}
          <div className="lg:col-span-2 space-y-6">
            <PriceChart crypto={crypto} />
            
            {/* Market Stats */}
            <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Market Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Market Cap</span>
                      <span className="font-medium text-foreground">
                        {formatMarketCap(crypto.market_data.market_cap.usd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Volume</span>
                      <span className="font-medium text-foreground">
                        {formatMarketCap(crypto.market_data.total_volume.usd)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h High</span>
                      <span className="font-medium text-success">
                        {formatPrice(crypto.market_data.high_24h.usd)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Circulating Supply</span>
                      <span className="font-medium text-foreground">
                        {crypto.market_data.circulating_supply?.toLocaleString()} {crypto.symbol.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Max Supply</span>
                      <span className="font-medium text-foreground">
                        {crypto.market_data.max_supply ? 
                          `${crypto.market_data.max_supply.toLocaleString()} ${crypto.symbol.toUpperCase()}` : 
                          'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">24h Low</span>
                      <span className="font-medium text-destructive">
                        {formatPrice(crypto.market_data.low_24h.usd)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {crypto.description.en && (
              <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">About {crypto.name}</h3>
                  <div 
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ 
                      __html: crypto.description.en.split('.').slice(0, 5).join('.') + '.' 
                    }}
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Trading Panel */}
          <div className="space-y-6">
            <TradingPanel crypto={crypto} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CryptoDetail;