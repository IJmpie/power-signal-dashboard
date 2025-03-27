
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceData } from "@/services/priceService";
import { cn } from "@/lib/utils";

type UsageRecommendationProps = {
  data: PriceData[];
  customThresholds?: {
    high: number;
    medium: number;
  };
};

export default function UsageRecommendation({ 
  data, 
  customThresholds = { high: 0.40, medium: 0.25 } 
}: UsageRecommendationProps) {
  // Group prices by high, medium, low using custom thresholds
  const highPrices = data.filter(price => price.totalPrice >= customThresholds.high);
  const mediumPrices = data.filter(price => price.totalPrice >= customThresholds.medium && price.totalPrice < customThresholds.high);
  const lowPrices = data.filter(price => price.totalPrice < customThresholds.medium);

  // Determine if we have enough low price periods
  const hasLowPrices = lowPrices.length > 0;

  // Get recommendation based on price distribution
  const getRecommendation = () => {
    if (lowPrices.length > 5) {
      return {
        title: "Goed moment voor zwaar verbruik",
        description: "Er zijn voldoende perioden met lage prijzen. Dit is een goed moment voor wasmachines, drogers en opladen van elektrische voertuigen.",
        color: "text-traffic-green"
      };
    } else if (mediumPrices.length > highPrices.length) {
      return {
        title: "Gemiddeld verbruik aanbevolen",
        description: "De prijzen zijn gemiddeld. Beperk zwaar verbruik waar mogelijk, maar normale activiteiten kunnen doorgaan.",
        color: "text-traffic-yellow"
      };
    } else {
      return {
        title: "Beperk elektriciteitsverbruik",
        description: "De prijzen zijn momenteel hoog. Stel het gebruik van zware apparaten uit indien mogelijk.",
        color: "text-traffic-red"
      };
    }
  };

  const recommendation = getRecommendation();

  return (
    <Card className="glass-card w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Gebruiksadvies</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className={cn("font-medium text-lg mb-2", recommendation.color)}>
          {recommendation.title}
        </h3>
        <p className="text-sm">{recommendation.description}</p>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-md bg-traffic-green/10 p-2">
            <p className="font-medium mb-1">Groen ({lowPrices.length})</p>
            <p className="text-muted-foreground">Ideaal voor hoog verbruik</p>
          </div>
          <div className="rounded-md bg-traffic-yellow/10 p-2">
            <p className="font-medium mb-1">Geel ({mediumPrices.length})</p>
            <p className="text-muted-foreground">Geschikt voor normaal verbruik</p>
          </div>
          <div className="rounded-md bg-traffic-red/10 p-2">
            <p className="font-medium mb-1">Rood ({highPrices.length})</p>
            <p className="text-muted-foreground">Beperk verbruik indien mogelijk</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
