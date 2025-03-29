
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type PriceThresholdSettingsProps = {
  initialHighThreshold: number;
  initialLowThreshold: number;
  onThresholdsChange: (highThreshold: number, mediumThreshold: number, lowThreshold: number) => void;
  initialMediumThreshold?: number; // Make medium optional
};

export default function PriceThresholdSettings({
  initialHighThreshold,
  initialLowThreshold,
  onThresholdsChange,
  initialMediumThreshold = 0.25 // Default value
}: PriceThresholdSettingsProps) {
  const [highThreshold, setHighThreshold] = useState(initialHighThreshold);
  const [lowThreshold, setLowThreshold] = useState(initialLowThreshold);
  
  // We still maintain mediumThreshold internally for compatibility
  const [mediumThreshold, setMediumThreshold] = useState(initialMediumThreshold);

  const handleSave = () => {
    // Validate thresholds
    if (highThreshold <= lowThreshold) {
      toast.error("Hoge prijsdrempel moet hoger zijn dan lage prijsdrempel");
      return;
    }
    
    if (lowThreshold < 0 || highThreshold <= 0) {
      toast.error("Prijsdrempels moeten positief zijn");
      return;
    }

    // Calculate medium threshold automatically as the middle point
    const calculatedMediumThreshold = (highThreshold + lowThreshold) / 2;
    setMediumThreshold(calculatedMediumThreshold);
    
    onThresholdsChange(highThreshold, calculatedMediumThreshold, lowThreshold);
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
          <p>Prijzen onder {lowThreshold.toFixed(2)}€/kWh worden als laag beschouwd (groen).</p>
          <p>Prijzen tussen {lowThreshold.toFixed(2)}€/kWh en {highThreshold.toFixed(2)}€/kWh worden als gemiddeld beschouwd (geel).</p>
          <p>Prijzen boven {highThreshold.toFixed(2)}€/kWh worden als hoog beschouwd (rood).</p>
        </div>
      </CardContent>
    </Card>
  );
}
