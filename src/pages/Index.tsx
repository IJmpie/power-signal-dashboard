
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
import PriceChart from "@/components/PriceChart";
import NotificationSettings from "@/components/NotificationSettings";
import PriceInfoCard from "@/components/PriceInfoCard";
import SourceAttribution from "@/components/SourceAttribution";
import HeaderAttribution from "@/components/HeaderAttribution";
import UsageRecommendation from "@/components/UsageRecommendation";
import PriceThresholdSettings from "@/components/PriceThresholdSettings";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { priceData, currentPrice, lastUpdated, isLoading, error, refreshData } = usePriceData();
  const isMobile = useIsMobile();
  const [thresholds, setThresholds] = useState(() => {
    const savedThresholds = localStorage.getItem('priceThresholds');
    return savedThresholds ? JSON.parse(savedThresholds) : { high: 0.40, medium: 0.25 };
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

  const handleThresholdsChange = (high: number, medium: number) => {
    setThresholds({ high, medium });
    localStorage.setItem('priceThresholds', JSON.stringify({ high, medium }));
  };

  // Helper function to get text color classes based on thresholds
  const getTextColorClass = (level: 'high' | 'medium' | 'low') => {
    if (level === 'high') return "text-traffic-red";
    if (level === 'medium') return "text-traffic-yellow";
    return "text-traffic-green";
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
        {/* Mobile layout */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Top section with traffic light and price */}
            <Card className="glass-card p-4 flex flex-col items-center">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {isLoading ? (
                  <Skeleton className="w-20 h-64 rounded-full" />
                ) : (
                  <TrafficLight 
                    currentPrice={currentPrice} 
                    customThresholds={thresholds}
                    className="mb-2"
                  />
                )}
                
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-40" />
                  </>
                ) : (
                  <PriceDisplay currentPrice={currentPrice} />
                )}
              </div>
              
              <div className="mt-3 text-xs text-muted-foreground flex items-center">
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

            {/* Legend card */}
            <Card className="glass-card p-4">
              <div>
                <h2 className="text-center text-lg font-medium mb-3">Legenda</h2>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-red mr-2" />
                    <span className={getTextColorClass('high')}>Hoog: &gt; €{thresholds.high.toFixed(2)}/kWh</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-yellow mr-2" />
                    <span className={getTextColorClass('medium')}>Gemiddeld: €{thresholds.medium.toFixed(2)} - €{thresholds.high.toFixed(2)}/kWh</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-green mr-2" />
                    <span className={getTextColorClass('low')}>Laag: &lt; €{thresholds.medium.toFixed(2)}/kWh</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Price chart */}
            {isLoading ? (
              <Card className="glass-card p-4">
                <Skeleton className="h-[250px] w-full" />
              </Card>
            ) : (
              <PriceChart data={priceData} />
            )}

            {/* Recommendations */}
            {!isLoading && (
              <UsageRecommendation 
                data={priceData} 
                customThresholds={thresholds}
              />
            )}
          </div>
        ) : (
          /* Desktop layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left sidebar - Traffic light and legend */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="glass-card p-6 flex flex-col items-center">
                {isLoading ? (
                  <Skeleton className="w-24 h-80 rounded-full" />
                ) : (
                  <TrafficLight 
                    currentPrice={currentPrice} 
                    customThresholds={thresholds}
                    className="mb-4"
                  />
                )}
                
                {isLoading ? (
                  <>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-8 w-40" />
                  </>
                ) : (
                  <PriceDisplay currentPrice={currentPrice} />
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

              <Card className="glass-card p-6">
                <div className="text-center">
                  <h2 className="text-lg font-medium">Legenda</h2>
                  <div className="mt-4 flex flex-col space-y-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-traffic-red mr-2" />
                      <span className={getTextColorClass('high')}>Hoog: &gt; €{thresholds.high.toFixed(2)}/kWh</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-traffic-yellow mr-2" />
                      <span className={getTextColorClass('medium')}>Gemiddeld: €{thresholds.medium.toFixed(2)} - €{thresholds.high.toFixed(2)}/kWh</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 rounded-full bg-traffic-green mr-2" />
                      <span className={getTextColorClass('low')}>Laag: &lt; €{thresholds.medium.toFixed(2)}/kWh</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Main content */}
            <div className="lg:col-span-9 space-y-6">
              {/* Price chart */}
              {isLoading ? (
                <Card className="glass-card p-6">
                  <Skeleton className="h-[300px] md:h-[400px] w-full" />
                </Card>
              ) : (
                <PriceChart data={priceData} />
              )}

              {/* Price info and notifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {!isLoading && <PriceInfoCard data={priceData} />}
                <NotificationSettings />
              </div>

              {/* Threshold settings and recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PriceThresholdSettings 
                  initialHighThreshold={thresholds.high}
                  initialMediumThreshold={thresholds.medium}
                  onThresholdsChange={handleThresholdsChange}
                />
                {!isLoading && (
                  <UsageRecommendation 
                    data={priceData} 
                    customThresholds={thresholds}
                  />
                )}
              </div>

              {/* Source attribution */}
              <SourceAttribution />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
