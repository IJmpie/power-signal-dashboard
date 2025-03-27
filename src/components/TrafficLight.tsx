
import { cn } from "@/lib/utils";

type TrafficLightProps = {
  currentPrice: number;
  className?: string;
};

export default function TrafficLight({ currentPrice, className }: TrafficLightProps) {
  const isRed = currentPrice >= 0.40;
  const isYellow = currentPrice >= 0.25 && currentPrice < 0.40;
  const isGreen = currentPrice < 0.25;

  return (
    <div className={cn(
      "traffic-light-container rounded-xl py-6 px-3 flex flex-col items-center justify-center gap-4 shadow-lg", 
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
