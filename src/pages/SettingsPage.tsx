
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";
import PriceThresholdSettings from "@/components/PriceThresholdSettings";
import SourceAttribution from "@/components/SourceAttribution";

export default function SettingsPage() {
  const [thresholds, setThresholds] = useState({ high: 0.40, medium: 0.25 });

  useEffect(() => {
    document.title = "Instellingen - Stroomprijs Stoplicht";
  }, []);

  const handleThresholdsChange = (high: number, medium: number) => {
    setThresholds({ high, medium });
    localStorage.setItem('priceThresholds', JSON.stringify({ high, medium }));
  };

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-b from-background to-secondary/50 dark:from-background dark:to-background">
      <header className="container flex items-center justify-between py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-semibold">Instellingen</h1>
      </header>

      <main className="container py-4">
        <div className="space-y-6">
          <Card className="p-4">
            <h2 className="text-lg font-medium mb-4">Weergave</h2>
            <div className="flex items-center justify-between">
              <span>Donkere modus</span>
              <ThemeToggle />
            </div>
          </Card>

          <PriceThresholdSettings 
            initialHighThreshold={thresholds.high}
            initialMediumThreshold={thresholds.medium}
            onThresholdsChange={handleThresholdsChange}
          />

          <SourceAttribution />
        </div>
      </main>
    </div>
  );
}
