
import { usePriceData } from "@/hooks/usePriceData";
import PriceChart from "@/components/PriceChart";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft, ArrowUp, ArrowDown, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "sonner";
import HeaderAttribution from "@/components/HeaderAttribution";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import PriceChangeIndicator from "@/components/PriceChangeIndicator";

export default function PricesPage() {
  const { priceData, currentPrice, isLoading, refreshData } = usePriceData();
  const [thresholds, setThresholds] = useState(() => {
    const savedThresholds = localStorage.getItem('priceThresholds');
    return savedThresholds ? JSON.parse(savedThresholds) : { high: 0.40, medium: 0.25, low: 0.15 };
  });

  const getPriceCategory = () => {
    if (currentPrice >= thresholds.high) return { category: "Hoog", color: "text-traffic-red" };
    if (currentPrice >= thresholds.medium) return { category: "Gemiddeld", color: "text-traffic-yellow" };
    return { category: "Laag", color: "text-traffic-green" };
  };

  const priceCategory = getPriceCategory();

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
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">Prijsverloop</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={handleRefresh}
        >
          <RefreshCw size={16} />
        </Button>
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)]">
        <main className="container mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HeaderAttribution />
            </div>
          </div>

          {/* Price Category */}
          <Card className="glass-card p-4">
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-lg font-medium">Huidige Prijscategorie</h2>
              <p className={cn("text-2xl font-bold mt-2", priceCategory.color)}>
                {priceCategory.category}
              </p>
              <div className="mt-2">
                <PriceChangeIndicator 
                  data={priceData} 
                  currentPrice={currentPrice} 
                  className="text-base font-medium"
                  showPercentage={true}
                />
              </div>
            </div>
          </Card>

          {isLoading ? (
            <Card className="glass-card p-4">
              <Skeleton className="h-[300px] w-full" />
            </Card>
          ) : (
            <PriceChart data={priceData} />
          )}
        </main>
      </ScrollArea>
    </div>
  );
}
