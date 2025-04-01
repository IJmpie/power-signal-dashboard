
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchCurrentPriceOnly } from "@/services/priceApiService";
import { toast } from "sonner";

type PriceDisplayProps = {
  currentPrice: number;
  className?: string;
};

export default function PriceDisplay({ currentPrice, className }: PriceDisplayProps) {
  const [directPrice, setDirectPrice] = useState<number | null>(() => {
    const savedPrice = localStorage.getItem('directPrice');
    return savedPrice ? parseFloat(savedPrice) : null;
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (directPrice !== null) {
      localStorage.setItem('directPrice', directPrice.toString());
    }
  }, [directPrice]);

  const getPriceColor = () => {
    const priceToUse = directPrice !== null ? directPrice : currentPrice;
    
    if (priceToUse >= 0.40) return "text-traffic-red";
    if (priceToUse >= 0.25) return "text-traffic-yellow";
    return "text-traffic-green";
  };

  // Function to fetch price directly using our API
  const fetchDirectPrice = async () => {
    setLoading(true);
    try {
      const result = await fetchCurrentPriceOnly();
      if (result) {
        setDirectPrice(result.currentPrice);
        toast.success("Prijs direct opgehaald");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fix Euro symbol display by directly using the € character with proper spacing
  const formattedPrice = `€${(directPrice !== null ? directPrice : currentPrice).toFixed(2)}`;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="text-sm font-medium text-muted-foreground mb-2 mt-2">
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
      
      {/* Button to test direct API call */}
      <Button 
        variant="outline"
        size="sm"
        className="mt-3"
        onClick={fetchDirectPrice}
        disabled={loading}
      >
        <RefreshCw className={cn("h-3 w-3 mr-2", loading && "animate-spin")} />
        Direct prijzen ophalen
      </Button>
    </div>
  );
}
