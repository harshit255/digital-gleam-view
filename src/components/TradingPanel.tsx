import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';

interface TradingPanelProps {
  crypto: any;
}

export const TradingPanel = ({ crypto }: TradingPanelProps) => {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const { toast } = useToast();
  const { addHolding, removeHolding } = useWallet();

  const currentPrice = crypto?.market_data?.current_price?.usd || 0;

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive"
      });
      return;
    }

    const quantity = amount / currentPrice;
    addHolding(crypto, quantity, currentPrice);
    setBuyAmount('');
    
    toast({
      title: "Purchase successful!",
      description: `Bought ${quantity.toFixed(6)} ${crypto.symbol.toUpperCase()} for $${amount}`,
    });
  };

  const handleSell = () => {
    const quantity = parseFloat(sellAmount);
    if (!quantity || quantity <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid quantity to sell.",
        variant: "destructive"
      });
      return;
    }

    removeHolding(crypto.id, quantity);
    setSellAmount('');
    
    const value = quantity * currentPrice;
    toast({
      title: "Sale successful!",
      description: `Sold ${quantity.toFixed(6)} ${crypto.symbol.toUpperCase()} for $${value.toFixed(2)}`,
    });
  };

  return (
    <Card className="bg-gradient-card backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5" />
          <span>Trade {crypto?.symbol?.toUpperCase()}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="buy" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="buy" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Buy</span>
            </TabsTrigger>
            <TabsTrigger value="sell" className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4" />
              <span>Sell</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Amount (USD)
              </label>
              <Input
                type="number"
                placeholder="Enter amount in USD"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="bg-card/50 border-border/50"
              />
              {buyAmount && (
                <p className="text-sm text-muted-foreground">
                  You will get: {(parseFloat(buyAmount) / currentPrice).toFixed(6)} {crypto?.symbol?.toUpperCase()}
                </p>
              )}
            </div>
            <Button 
              onClick={handleBuy}
              className="w-full bg-success hover:bg-success/90"
              disabled={!buyAmount}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Buy {crypto?.symbol?.toUpperCase()}
            </Button>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Quantity
              </label>
              <Input
                type="number"
                placeholder={`Enter ${crypto?.symbol?.toUpperCase()} amount`}
                value={sellAmount}
                onChange={(e) => setSellAmount(e.target.value)}
                className="bg-card/50 border-border/50"
              />
              {sellAmount && (
                <p className="text-sm text-muted-foreground">
                  You will get: ${(parseFloat(sellAmount) * currentPrice).toFixed(2)} USD
                </p>
              )}
            </div>
            <Button 
              onClick={handleSell}
              variant="destructive"
              className="w-full"
              disabled={!sellAmount}
            >
              <TrendingDown className="w-4 h-4 mr-2" />
              Sell {crypto?.symbol?.toUpperCase()}
            </Button>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Current Price: <span className="font-medium text-foreground">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};