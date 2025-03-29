
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type PriceThresholdSettingsProps = {
  initialHighThreshold: number;
  initialLowThreshold: number;
  initialMediumThreshold?: number;
  onThresholdsChange: (high: number, low: number, medium?: number) => void;
};

export default function PriceThresholdSettings({
  initialHighThreshold,
  initialLowThreshold,
  initialMediumThreshold,
  onThresholdsChange
}: PriceThresholdSettingsProps) {
  const [highThreshold, setHighThreshold] = useState(initialHighThreshold);
  const [lowThreshold, setLowThreshold] = useState(initialLowThreshold);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    setHighThreshold(initialHighThreshold);
    setLowThreshold(initialLowThreshold);
  }, [initialHighThreshold, initialLowThreshold]);

  const handleHighThresholdChange = (value: number[]) => {
    const newValue = value[0];
    if (newValue > lowThreshold) {
      setHighThreshold(newValue);
      setChanged(true);
    }
  };

  const handleLowThresholdChange = (value: number[]) => {
    const newValue = value[0];
    if (newValue < highThreshold) {
      setLowThreshold(newValue);
      setChanged(true);
    }
  };

  const handleHighInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value > lowThreshold) {
      setHighThreshold(value);
      setChanged(true);
    }
  };

  const handleLowInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value < highThreshold) {
      setLowThreshold(value);
      setChanged(true);
    }
  };

  const handleSave = () => {
    // Calculate medium as the middle value between high and low
    const medium = (highThreshold + lowThreshold) / 2;
    onThresholdsChange(highThreshold, lowThreshold, medium);
    setChanged(false);
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-lg font-medium">Pas prijsdrempels aan</h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="p-0 h-8 w-8 ml-1">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pas de drempelwaarden aan om de stoplichtlkleuren te wijzigen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {changed && (
          <Button size="sm" onClick={handleSave}>
            Opslaan
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="high-threshold" className="text-traffic-red">
              Hoge prijs drempel
            </Label>
            <div className="flex items-center">
              <span className="mr-2">€</span>
              <Input 
                id="high-threshold-input"
                type="number"
                value={highThreshold.toString()}
                onChange={handleHighInputChange}
                className="w-20"
                step={0.01}
                min={lowThreshold + 0.01}
                max={0.60}
              />
              <span className="ml-2">/kWh</span>
            </div>
          </div>
          <Slider 
            id="high-threshold"
            min={0.10} 
            max={0.60} 
            step={0.01} 
            value={[highThreshold]} 
            onValueChange={handleHighThresholdChange}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>€0.10</span>
            <span>€0.60</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="low-threshold" className="text-traffic-green">
              Lage prijs drempel
            </Label>
            <div className="flex items-center">
              <span className="mr-2">€</span>
              <Input 
                id="low-threshold-input"
                type="number"
                value={lowThreshold.toString()}
                onChange={handleLowInputChange}
                className="w-20"
                step={0.01}
                min={0.10}
                max={highThreshold - 0.01}
              />
              <span className="ml-2">/kWh</span>
            </div>
          </div>
          <Slider 
            id="low-threshold"
            min={0.10} 
            max={0.60} 
            step={0.01} 
            value={[lowThreshold]} 
            onValueChange={handleLowThresholdChange}
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>€0.10</span>
            <span>€0.60</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="font-medium mb-2">Huidige instellingen:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-traffic-red mr-2" />
            <span>Hoge prijs: &gt; €{highThreshold.toFixed(2)}/kWh</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-traffic-yellow mr-2" />
            <span>Gemiddelde prijs: €{lowThreshold.toFixed(2)} - €{highThreshold.toFixed(2)}/kWh</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-traffic-green mr-2" />
            <span>Lage prijs: &lt; €{lowThreshold.toFixed(2)}/kWh</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
