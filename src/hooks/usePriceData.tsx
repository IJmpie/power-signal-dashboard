
import { useState, useEffect } from "react";
import { getPriceData, PriceData } from "@/services/priceService";
import { toast } from "sonner";

export function usePriceData() {
  const [priceData, setPriceData] = useState<PriceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchPriceData = async () => {
    try {
      setIsLoading(true);
      const data = await getPriceData();
      setPriceData(data);
      
      // Find the current price (the price for the time slot that includes the current time)
      const now = new Date();
      const currentPricePoint = data.find(price => 
        new Date(price.from) <= now && new Date(price.till) > now
      );
      
      if (currentPricePoint) {
        setCurrentPrice(currentPricePoint.totalPrice);
      } else if (data.length > 0) {
        // If we can't find a current price point, use the latest one
        setCurrentPrice(data[data.length - 1].totalPrice);
      }
      
      setLastUpdated(new Date());
      setError(null);
    } catch (error) {
      console.error("Error fetching price data:", error);
      setError("Er is een fout opgetreden bij het ophalen van de prijsgegevens.");
      toast.error("Fout bij het ophalen van prijsgegevens");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriceData();
    
    // Set up auto-refresh every 60 seconds
    const intervalId = setInterval(() => {
      fetchPriceData();
    }, 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    priceData,
    currentPrice,
    lastUpdated,
    isLoading,
    error,
    refreshData: fetchPriceData
  };
}
