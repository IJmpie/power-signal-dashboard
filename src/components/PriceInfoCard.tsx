
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceData } from "@/services/priceService";
import { formatDateToTime } from "@/lib/utils";

type PriceInfoCardProps = {
  data: PriceData[];
};

export default function PriceInfoCard({ data }: PriceInfoCardProps) {
  // Get the 5 cheapest hours
  const cheapestHours = [...data]
    .sort((a, b) => a.totalPrice - b.totalPrice)
    .slice(0, 5);

  // Find the best time slot for electricity usage
  const findBestTimeSlot = () => {
    const now = new Date();
    const futureData = data.filter(item => new Date(item.from) > now);
    
    if (futureData.length === 0) return null;
    
    return futureData.reduce((best, current) => 
      current.totalPrice < best.totalPrice ? current : best, 
      futureData[0]
    );
  };

  const bestTimeSlot = findBestTimeSlot();

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="text-lg">Stroomprijsinformatie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">Wanneer is stroom het goedkoopst?</h3>
          {bestTimeSlot ? (
            <div className="text-sm">
              <p>De beste tijd om stroom te verbruiken is tussen: </p>
              <p className="font-medium text-traffic-green mt-1">
                {formatDateToTime(new Date(bestTimeSlot.from))} - {formatDateToTime(new Date(bestTimeSlot.till))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Prijs: €{bestTimeSlot.totalPrice.toFixed(2)}/kWh
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Geen voorspellingsdata beschikbaar
            </p>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Goedkoopste uren vandaag:</h3>
          <ul className="space-y-1 text-sm">
            {cheapestHours.map((hour, index) => (
              <li key={index} className="flex justify-between">
                <span>{formatDateToTime(new Date(hour.from))} - {formatDateToTime(new Date(hour.till))}</span>
                <span className="font-medium">€{hour.totalPrice.toFixed(2)}/kWh</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-2">Tips voor elektriciteitsverbruik:</h3>
          <ul className="text-sm space-y-1 list-disc pl-5">
            <li>Gebruik apparaten met hoog verbruik (zoals wasmachine, droger) tijdens goedkope uren</li>
            <li>Laad elektrische voertuigen op wanneer de stroom het goedkoopst is</li>
            <li>Overweeg om 's nachts zware apparaten te gebruiken wanneer de prijzen vaak lager zijn</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
