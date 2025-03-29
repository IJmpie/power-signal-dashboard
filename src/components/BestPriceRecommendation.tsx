
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceData } from "@/services/priceService";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

type BestPriceRecommendationProps = {
  data: PriceData[];
  customThresholds?: {
    high: number;
    medium: number;
    low: number;
  };
};

export default function BestPriceRecommendation({ 
  data, 
  customThresholds = { high: 0.40, medium: 0.25, low: 0.15 }
}: BestPriceRecommendationProps) {
  if (!data || data.length === 0) return null;

  // Getting the current time to filter future prices
  const now = new Date();
  
  // Filter to only include future prices
  const futurePrices = data.filter(price => new Date(price.from) > now);
  
  // Find the minimum price in the future
  const lowestPrice = futurePrices.reduce(
    (min, price) => price.totalPrice < min.totalPrice ? price : min, 
    futurePrices[0] || { totalPrice: Infinity }
  );
  
  // No future prices available
  if (!futurePrices.length || lowestPrice.totalPrice === Infinity) {
    return null;
  }
  
  const formatTimeRange = (from: string, till: string) => {
    const fromDate = new Date(from);
    const tillDate = new Date(till);
    return `${format(fromDate, 'HH:mm', { locale: nl })} - ${format(tillDate, 'HH:mm', { locale: nl })}`;
  };
  
  const getPriceColor = (price: number) => {
    if (price >= customThresholds.high) return "text-traffic-red";
    if (price >= customThresholds.medium) return "text-traffic-yellow";
    return "text-traffic-green";
  };

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Wanneer is stroom het goedkoopst?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center bg-secondary/30 p-3 rounded-lg">
            <div>
              <p className="font-medium">Beste tijdstip vandaag:</p>
              <p className="text-lg">{formatTimeRange(lowestPrice.from, lowestPrice.till)}</p>
            </div>
            <div className={cn("text-xl font-bold", getPriceColor(lowestPrice.totalPrice))}>
              {formatCurrency(lowestPrice.totalPrice)}/kWh
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Het kan verstandig zijn om grote energieverbruikers zoals wasmachines, drogers en 
            vaatwassers te gebruiken als de prijs het laagst is. Zo bespaar je geld op je energierekening.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
