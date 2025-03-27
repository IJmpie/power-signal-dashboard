
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

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

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-sm font-medium text-muted-foreground mb-1">
        Huidige Stroomprijs
      </div>
      <div className={cn("text-4xl font-bold tracking-tight", getPriceColor())}>
        {formatCurrency(currentPrice)}
        <span className="text-base font-normal text-muted-foreground ml-1">
          /kWh
        </span>
      </div>
    </div>
  );
}
