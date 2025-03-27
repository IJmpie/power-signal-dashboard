
import { useEffect, useState } from "react";
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
import NotificationSettings from "@/components/NotificationSettings";
import PriceInfoCard from "@/components/PriceInfoCard";
import SourceAttribution from "@/components/SourceAttribution";
import HeaderAttribution from "@/components/HeaderAttribution";
import UsageRecommendation from "@/components/UsageRecommendation";
import PriceThresholdSettings from "@/components/PriceThresholdSettings";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const { priceData, currentPrice, lastUpdated, isLoading, error, refreshData } = usePriceData();
  const [thresholds, setThresholds] = useState({ high: 0.40, medium: 0.25 });

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Stroomprijs Stoplicht</h1>
          <HeaderAttribution />
        </div>
        <ThemeToggle />
      </header>

      <main className="container pb-12 mt-6">
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
                    <span>Hoog: &gt; €{thresholds.high.toFixed(2)}/kWh</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-yellow mr-2" />
                    <span>Gemiddeld: €{thresholds.medium.toFixed(2)} - €{thresholds.high.toFixed(2)}/kWh</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-traffic-green mr-2" />
                    <span>Laag: &lt; €{thresholds.medium.toFixed(2)}/kWh</span>
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
      </main>
    </div>
  );
};

export default Index;
