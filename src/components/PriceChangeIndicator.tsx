
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { PriceData } from "@/services/priceService";

type PriceChangeIndicatorProps = {
  data: PriceData[];
  currentPrice: number;
  className?: string;
  showPercentage?: boolean;
};

export default function PriceChangeIndicator({ data, currentPrice, className, showPercentage = false }: PriceChangeIndicatorProps) {
  if (data.length < 2) return null;
  
  // Calculate the average of the last 3 hours (if available)
  const calculateRecentAverage = () => {
    const recentPrices = data.slice(-4, -1);
    if (recentPrices.length === 0) return currentPrice;
    
    return recentPrices.reduce((sum, price) => sum + price.totalPrice, 0) / recentPrices.length;
  };
  
  const recentAverage = calculateRecentAverage();
  const percentChange = ((currentPrice - recentAverage) / recentAverage) * 100;
  const formattedChange = Math.abs(percentChange).toFixed(1);
  
  const getChangeType = () => {
    if (percentChange > 10) return "strong-increase";
    if (percentChange > 2) return "slight-increase";
    if (percentChange < -10) return "strong-decrease";
    if (percentChange < -2) return "slight-decrease";
    return "stable";
  };
  
  const changeType = getChangeType();
  
  const getChangeText = () => {
    switch (changeType) {
      case "strong-increase":
        return "Sterk stijgend";
      case "slight-increase":
        return "Licht stijgend";
      case "strong-decrease":
        return "Sterk dalend";
      case "slight-decrease":
        return "Licht dalend";
      case "stable":
        return "Stabiel";
    }
  };
  
  const getChangeIcon = () => {
    switch (changeType) {
      case "strong-increase":
        return <TrendingUp className="h-4 w-4" />;
      case "slight-increase":
        return <ArrowUp className="h-4 w-4" />;
      case "strong-decrease":
        return <TrendingDown className="h-4 w-4" />;
      case "slight-decrease":
        return <ArrowDown className="h-4 w-4" />;
      case "stable":
        return null;
    }
  };
  
  const getChangeColor = () => {
    if (changeType.includes("increase")) return "text-traffic-red";
    if (changeType.includes("decrease")) return "text-traffic-green";
    return "text-muted-foreground";
  };
  
  return (
    <div className={cn("flex items-center gap-1", className, getChangeColor())}>
      {getChangeIcon()}
      <span className="text-sm font-medium">{getChangeText()}</span>
      {(changeType !== "stable" || showPercentage) && (
        <span className="text-xs">
          ({percentChange > 0 ? "+" : ""}{formattedChange}%)
        </span>
      )}
    </div>
  );
}
