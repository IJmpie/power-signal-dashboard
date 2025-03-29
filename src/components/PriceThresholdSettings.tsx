
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PriceThresholdSettingsProps = {
  initialHighThreshold: number;
  initialMediumThreshold: number;
  initialLowThreshold: number;
  onThresholdsChange: (highThreshold: number, mediumThreshold: number, lowThreshold: number) => void;
};

export default function PriceThresholdSettings({
  initialHighThreshold,
  initialMediumThreshold,
  initialLowThreshold,
  onThresholdsChange
}: PriceThresholdSettingsProps) {
  const [highThreshold, setHighThreshold] = useState(initialHighThreshold);
  const [mediumThreshold, setMediumThreshold] = useState(initialMediumThreshold);
  const [lowThreshold, setLowThreshold] = useState(initialLowThreshold);

  const handleSave = () => {
    // Validate thresholds
    if (highThreshold <= mediumThreshold) {
      toast.error("Hoge prijsdrempel moet hoger zijn dan gemiddelde prijsdrempel");
      return;
    }
    
    if (mediumThreshold <= lowThreshold) {
      toast.error("Gemiddelde prijsdrempel moet hoger zijn dan lage prijsdrempel");
      return;
    }
    
    if (lowThreshold < 0 || mediumThreshold <= 0 || highThreshold <= 0) {
      toast.error("Prijsdrempels moeten positief zijn");
      return;
    }

    onThresholdsChange(highThreshold, mediumThreshold, lowThreshold);
    toast.success("Prijsdrempels opgeslagen");
  };

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="text-lg">Pas prijsdrempels aan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="high-threshold">Hoge prijs vanaf (€/kWh):</Label>
          <div className="flex items-center gap-2">
            <Input
              id="high-threshold"
              type="number"
              step="0.01"
              min="0"
              value={highThreshold}
              onChange={(e) => setHighThreshold(parseFloat(e.target.value))}
            />
            <div className="w-6 h-6 rounded-full bg-traffic-red flex-shrink-0"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="medium-threshold">Gemiddelde prijs vanaf (€/kWh):</Label>
          <div className="flex items-center gap-2">
            <Input
              id="medium-threshold"
              type="number"
              step="0.01"
              min="0"
              value={mediumThreshold}
              onChange={(e) => setMediumThreshold(parseFloat(e.target.value))}
            />
            <div className="w-6 h-6 rounded-full bg-traffic-yellow flex-shrink-0"></div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="low-threshold">Lage prijs vanaf (€/kWh):</Label>
          <div className="flex items-center gap-2">
            <Input
              id="low-threshold"
              type="number"
              step="0.01"
              min="0"
              value={lowThreshold}
              onChange={(e) => setLowThreshold(parseFloat(e.target.value))}
            />
            <div className="w-6 h-6 rounded-full bg-traffic-green flex-shrink-0"></div>
          </div>
        </div>
        
        <div className="pt-2">
          <Button onClick={handleSave} className="w-full">Opslaan</Button>
        </div>

        <div className="text-xs text-muted-foreground mt-2">
          <p>Prijzen onder {lowThreshold.toFixed(2)}€/kWh worden als zeer laag beschouwd.</p>
          <p>Prijzen tussen {lowThreshold.toFixed(2)}€/kWh en {mediumThreshold.toFixed(2)}€/kWh worden als laag beschouwd (groen).</p>
          <p>Prijzen tussen {mediumThreshold.toFixed(2)}€/kWh en {highThreshold.toFixed(2)}€/kWh worden als gemiddeld beschouwd (geel).</p>
          <p>Prijzen boven {highThreshold.toFixed(2)}€/kWh worden als hoog beschouwd (rood).</p>
        </div>
      </CardContent>
    </Card>
  );
}
