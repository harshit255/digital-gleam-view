import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet as WalletIcon, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';

const Wallet = () => {
  const navigate = useNavigate();
  const { holdings, totalValue, updateCurrentPrices } = useWallet();
  const { toast } = useToast();

  useEffect(() => {
    // Update prices when component mounts
    if (holdings.length > 0) {
      const cryptoIds = holdings.map(h => h.id);
      updateCurrentPrices(cryptoIds);
    }
  }, []);

  const handleRefreshPrices = async () => {
    if (holdings.length > 0) {
      const cryptoIds = holdings.map(h => h.id);
      await updateCurrentPrices(cryptoIds);
      toast({
        title: "Prices updated",
        description: "Your portfolio values have been refreshed.",
      });
    }
  };

  const formatPrice = (price: number) => {
    if (price < 1) {
      return `$${price.toFixed(6)}`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const calculateProfitLoss = (holding: any) => {
    const currentValue = holding.amount * holding.currentPrice;
    const initialValue = holding.amount * holding.averagePrice;
    return currentValue - initialValue;
  };

  const calculateProfitLossPercentage = (holding: any) => {
    const profitLoss = calculateProfitLoss(holding);
    const initialValue = holding.amount * holding.averagePrice;
    return initialValue > 0 ? (profitLoss / initialValue) * 100 : 0;
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
                <WalletIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                  My Wallet
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Portfolio Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <WalletIcon className="w-6 h-6" />
                  <span>Portfolio Overview</span>
                </CardTitle>
                {holdings.length > 0 && (
                  <Button
                    onClick={handleRefreshPrices}
                    variant="outline"
                    size="sm"
                    className="bg-card/50 border-border/50 hover:bg-card/80"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh Prices
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {formatPrice(totalValue)}
                </div>
                <p className="text-muted-foreground">Total Portfolio Value</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Holdings */}
        {holdings.length === 0 ? (
          <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
            <CardContent className="p-12 text-center">
              <WalletIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Your wallet is empty</h3>
              <p className="text-muted-foreground mb-6">
                Start trading cryptocurrencies to build your portfolio
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-gradient-crypto hover:opacity-90"
              >
                Browse Cryptocurrencies
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground mb-4">Your Holdings</h2>
            <div className="grid gap-4">
              {holdings.map((holding) => {
                const profitLoss = calculateProfitLoss(holding);
                const profitLossPercentage = calculateProfitLossPercentage(holding);
                const isProfit = profitLoss >= 0;
                const currentValue = holding.amount * holding.currentPrice;

                return (
                  <Card 
                    key={holding.id} 
                    className="bg-gradient-card backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    onClick={() => navigate(`/crypto/${holding.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img
                            src={holding.image}
                            alt={holding.name}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder.svg';
                            }}
                          />
                          <div>
                            <h3 className="font-semibold text-foreground">{holding.name}</h3>
                            <p className="text-sm text-muted-foreground uppercase">
                              {holding.symbol}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-bold text-foreground">
                            {formatPrice(currentValue)}
                          </div>
                          <div className={`flex items-center text-sm font-medium ${isProfit ? 'text-success' : 'text-destructive'}`}>
                            {isProfit ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                            {isProfit ? '+' : ''}{formatPrice(profitLoss)} ({Math.abs(profitLossPercentage).toFixed(2)}%)
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50">
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Holdings</span>
                            <div className="font-medium text-foreground">
                              {holding.amount.toFixed(6)} {holding.symbol.toUpperCase()}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Avg. Buy Price</span>
                            <div className="font-medium text-foreground">
                              {formatPrice(holding.averagePrice)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Current Price</span>
                            <div className="font-medium text-foreground">
                              {formatPrice(holding.currentPrice)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wallet;