
import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  currentPrice: number;
  className?: string;
};

export default function PriceDisplay({ currentPrice, className }: PriceDisplayProps) {
  const getPriceColor = () => {
    if (currentPrice >= 0.40) return "text-traffic-red";
    if (currentPrice >= 0.25) return "text-traffic-yellow";
    return "text-traffic-green";
  };

  // Fix Euro symbol display by directly using the € character with proper spacing
  const formattedPrice = `€${currentPrice.toFixed(2)}`;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-sm font-medium text-muted-foreground mb-1">
        Huidige Stroomprijs
      </div>
      <div className={cn("text-4xl font-bold tracking-tight", getPriceColor())}>
        {formattedPrice}
        <span className="text-base font-normal text-muted-foreground ml-1">
          /kWh
        </span>
      </div>
      <div className="text-xs text-muted-foreground mt-1">
        Inclusief belastingen en netbeheerkosten
      </div>
    </div>
  );
}
