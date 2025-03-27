
import { useEffect } from "react";
import { usePriceData } from "@/hooks/usePriceData";
import { formatFullDate } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import ThemeToggle from "@/components/ThemeToggle";
import TrafficLight from "@/components/TrafficLight";
import PriceDisplay from "@/components/PriceDisplay";
import PriceChart from "@/components/PriceChart";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { priceData, currentPrice, lastUpdated, isLoading, error, refreshData } = usePriceData();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleRefresh = () => {
    toast.promise(
      async () => {
        await refreshData();
      },
      {
        loading: "Prijzen vernieuwen...",
        success: "Prijzen zijn bijgewerkt",
        error: "Kon prijzen niet bijwerken"
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-6">
        <h1 className="text-xl font-semibold">Stroomprijs Stoplicht</h1>
        <ThemeToggle />
      </header>

      <main className="container pb-12 space-y-8 mt-4">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-8 md:space-y-0 md:space-x-6">
          <Card className="glass-card w-full md:w-auto p-6 flex flex-col md:flex-row items-center gap-6">
            {isLoading ? (
              <Skeleton className="w-24 h-80 rounded-full" />
            ) : (
              <TrafficLight currentPrice={currentPrice} />
            )}
            
            <div className="flex flex-col items-center md:items-start">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-40" />
                </>
              ) : (
                <PriceDisplay currentPrice={currentPrice} />
              )}
              
              <div className="mt-6 text-xs text-muted-foreground flex items-center">
                <span>Laatste update: {lastUpdated ? formatFullDate(lastUpdated) : 'Laden...'}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-1 h-6 w-6" 
                  onClick={handleRefresh}
                >
                  <RefreshCw size={12} />
                </Button>
              </div>
            </div>
          </Card>

          <Card className="glass-card w-full md:w-auto p-6">
            <div className="text-center">
              <h2 className="text-lg font-medium">Legenda</h2>
              <div className="mt-4 flex flex-col space-y-4">
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-traffic-red mr-2" />
                  <span>Hoog: &gt; €0,40/kWh</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-traffic-yellow mr-2" />
                  <span>Gemiddeld: €0,25 - €0,40/kWh</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 rounded-full bg-traffic-green mr-2" />
                  <span>Laag: &lt; €0,25/kWh</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <Card className="glass-card p-6">
              <Skeleton className="h-[300px] md:h-[400px] w-full" />
            </Card>
          ) : (
            <PriceChart data={priceData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
