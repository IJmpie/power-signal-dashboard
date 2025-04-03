
import { useEffect, useState } from "react";
import { usePriceData } from "@/hooks/usePriceData";
import { formatFullDate } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

import ThemeToggle from "@/components/ThemeToggle";
import TrafficLight from "@/components/TrafficLight";
import PriceDisplay from "@/components/PriceDisplay";
import BestPriceRecommendation from "@/components/BestPriceRecommendation";
import HeaderAttribution from "@/components/HeaderAttribution";
import PriceChangeIndicator from "@/components/PriceChangeIndicator";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { priceData, currentPrice, lastUpdated, isLoading, error, refreshData } = usePriceData();
  const isMobile = useIsMobile();
  const [thresholds, setThresholds] = useState(() => {
    const savedThresholds = localStorage.getItem('priceThresholds');
    return savedThresholds ? JSON.parse(savedThresholds) : { high: 0.40, medium: 0.25, low: 0.15 };
  });

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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background pb-16">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h1 className="text-lg md:text-xl font-semibold">Stroomprijs Stoplicht</h1>
        </div>
        <div className="flex items-center gap-2">
          <HeaderAttribution compact={isMobile} />
          <ThemeToggle />
        </div>
      </header>

      <main className="container pb-6 mt-4">
        <div className={isMobile ? "space-y-4" : "grid grid-cols-1 lg:grid-cols-12 gap-6"}>
          {/* Traffic Light Section */}
          <div className={isMobile ? "" : "lg:col-span-5 space-y-6"}>
            <Card className="glass-card p-6 flex flex-col items-center">
              {isLoading ? (
                <Skeleton className="w-32 h-96 rounded-full" />
              ) : (
                <TrafficLight 
                  currentPrice={currentPrice} 
                  customThresholds={thresholds}
                  className="mb-4 scale-125 transform"
                />
              )}
              
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-40" />
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <PriceDisplay currentPrice={currentPrice} />
                  <PriceChangeIndicator 
                    data={priceData} 
                    currentPrice={currentPrice} 
                    className="mt-2"
                  />
                </div>
              )}
              
              <div className="mt-4 text-xs text-muted-foreground flex items-center">
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
            </Card>
          </div>

          {/* Best Price Recommendation */}
          <div className={isMobile ? "" : "lg:col-span-7"}>
            {!isLoading && (
              <BestPriceRecommendation 
                data={priceData} 
                customThresholds={thresholds}
              />
            )}
            
            {/* Legend - Moved below BestPriceRecommendation */}
            <Card className="glass-card p-6 mt-4">
              <div className="text-center">
                <h2 className="text-lg font-medium">Legenda</h2>
                <div className="mt-4 flex flex-col space-y-4">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-red mr-2" />
                    <span className="text-traffic-red">Hoog: &gt; €{thresholds.high.toFixed(2)}/kWh</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-yellow mr-2" />
                    <span className="text-traffic-yellow">Gemiddeld: €{thresholds.medium.toFixed(2)} - €{thresholds.high.toFixed(2)}/kWh</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-green mr-2" />
                    <span className="text-traffic-green">Laag: &lt; €{thresholds.medium.toFixed(2)}/kWh</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
