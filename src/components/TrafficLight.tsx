
import { cn } from "@/lib/utils";

type TrafficLightProps = {
  currentPrice: number;
  className?: string;
  customThresholds?: {
    high: number;
    medium: number;
  };
};

export default function TrafficLight({ 
  currentPrice, 
  className,
  customThresholds = { high: 0.40, medium: 0.25 }
}: TrafficLightProps) {
  const isRed = currentPrice >= customThresholds.high;
  const isYellow = currentPrice >= customThresholds.medium && currentPrice < customThresholds.high;
  const isGreen = currentPrice < customThresholds.medium;

  return (
    <div className={cn(
      "traffic-light-container rounded-xl py-6 px-3 flex flex-col items-center justify-center gap-4 shadow-lg border-2 border-gray-700 dark:border-gray-500 scale-110 transform hover:scale-115 transition-transform duration-300", 
      className
    )}>
      <div
        className={cn(
          "traffic-light rounded-full",
          isRed ? "traffic-light-active bg-traffic-red" : "traffic-light-inactive bg-traffic-red/50",
        )}
        style={{ "--glow-color-rgb": "255, 59, 48" } as React.CSSProperties}
      />
      <div
        className={cn(
          "traffic-light rounded-full",
          isYellow ? "traffic-light-active bg-traffic-yellow" : "traffic-light-inactive bg-traffic-yellow/50",
        )}
        style={{ "--glow-color-rgb": "255, 204, 0" } as React.CSSProperties}
      />
      <div
        className={cn(
          "traffic-light rounded-full",
          isGreen ? "traffic-light-active bg-traffic-green" : "traffic-light-inactive bg-traffic-green/50",
        )}
        style={{ "--glow-color-rgb": "52, 199, 89" } as React.CSSProperties}
      />
    </div>
  );
}
