
import { toast } from "sonner";

// Simple API response type for the current price
export type CurrentPriceResponse = {
  currentPrice: number;
  timestamp: string;
};

/**
 * Fetches the current electricity price via a POST request
 * This endpoint doesn't require any API keys
 * @returns The current electricity price or null if there's an error
 */
export async function fetchCurrentPriceOnly(): Promise<CurrentPriceResponse | null> {
  try {
    const response = await fetch("/api/current-price", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ request: "currentPrice" }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch current price:", error);
    toast.error("Kon de huidige prijs niet ophalen");
    return null;
  }
}

/**
 * Example of how to use this API in your code
 * 
 * import { fetchCurrentPriceOnly } from "@/services/priceApiService";
 * 
 * // In a React component:
 * const [price, setPrice] = useState(0);
 * 
 * const getPrice = async () => {
 *   const result = await fetchCurrentPriceOnly();
 *   if (result) {
 *     setPrice(result.currentPrice);
 *   }
 * };
 * 
 * // Call getPrice() when needed
 */
