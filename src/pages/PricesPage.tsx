
import { usePriceData } from "@/hooks/usePriceData";
import PriceChart from "@/components/PriceChart";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import HeaderAttribution from "@/components/HeaderAttribution";

export default function PricesPage() {
  const { priceData, isLoading, refreshData } = usePriceData();

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

      <main className="container mt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <HeaderAttribution />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">1u</Button>
            <Button variant="outline" size="sm">12u</Button>
            <Button variant="default" size="sm">24u</Button>
          </div>
        </div>

        {isLoading ? (
          <Card className="glass-card p-4">
            <Skeleton className="h-[300px] w-full" />
          </Card>
        ) : (
          <PriceChart data={priceData} />
        )}
      </main>
    </div>
  );
}
