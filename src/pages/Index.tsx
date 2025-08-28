import { useState } from 'react';
import { RefreshCw, Activity, TrendingUp, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CryptoCard } from '@/components/CryptoCard';
import { SearchBar } from '@/components/SearchBar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useCrypto } from '@/hooks/useCrypto';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { cryptos, loading, error, searchCryptos, refetch } = useCrypto();
  const { toast } = useToast();
  const navigate = useNavigate();

  const filteredCryptos = searchCryptos(searchQuery);

  const handleRefresh = async () => {
    await refetch();
    toast({
      title: "Data refreshed",
      description: "Cryptocurrency prices have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-crypto rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-crypto bg-clip-text text-transparent">
                  CryptoTracker
                </h1>
                <p className="text-sm text-muted-foreground">Real-time cryptocurrency prices</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search cryptocurrencies..."
              />
              <Button
                onClick={() => navigate('/wallet')}
                variant="outline"
                size="sm"
                className="bg-card/50 border-border/50 hover:bg-card/80"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Wallet
              </Button>
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                className="bg-card/50 border-border/50 hover:bg-card/80"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="mb-8 bg-gradient-card backdrop-blur-sm rounded-2xl border border-border/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Market Overview</h2>
              <p className="text-muted-foreground">
                Tracking {cryptos.length} cryptocurrencies with real-time updates
              </p>
            </div>
            <div className="flex items-center space-x-2 text-success">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">Live Data</span>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-destructive">Error: {error}</p>
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {loading && cryptos.length === 0 && <LoadingSpinner />}

        {/* Search Results Info */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              Found {filteredCryptos.length} results for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Crypto Grid */}
        {!loading && filteredCryptos.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No cryptocurrencies found matching "{searchQuery}"
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCryptos.map((crypto) => (
            <CryptoCard key={crypto.id} crypto={crypto} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
