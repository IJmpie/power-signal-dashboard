export type PriceData = {
  from: string;
  till: string;
  marketPrice: number;
  marketPriceTax: number;
  sourcingMarkupPrice: number;
  energyTaxPrice: number;
  perUnit: string;
  totalPrice: number;
};

export async function getPriceData(date: string = getCurrentDate()): Promise<PriceData[]> {
  try {
    const query = `
      query MarketPrices {
        marketPrices(date:"${date}") {
          electricityPrices {
            from
            till
            marketPrice
            marketPriceTax
            sourcingMarkupPrice
            energyTaxPrice
            perUnit
          }
        }
      }
    `;

    const response = await fetch("https://graphql.frankenergie.nl", {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "content-type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.errors) {
      throw new Error(`GraphQL error: ${data.errors.map((e: any) => e.message).join(', ')}`);
    }

    // Transform the data to include a totalPrice property
    return data.data.marketPrices.electricityPrices.map((price: Omit<PriceData, 'totalPrice'>) => ({
      ...price,
      totalPrice: price.marketPrice + price.marketPriceTax + price.sourcingMarkupPrice + price.energyTaxPrice
    }));
  } catch (error) {
    console.error("Failed to fetch price data:", error);
    return generateMockPriceData(); // In case of error, return mock data
  }
}

/**
 * Get only the current electricity price
 * This is a simpler function that returns just the current price
 * No API key required
 */
export async function getCurrentPriceOnly(): Promise<number> {
  try {
    const data = await getPriceData();
    
    // Find the current price for the current time slot
    const now = new Date();
    const currentPricePoint = data.find(price => 
      new Date(price.from) <= now && new Date(price.till) > now
    );
    
    if (currentPricePoint) {
      return currentPricePoint.totalPrice;
    } else if (data.length > 0) {
      // If no exact match, use the latest price
      return data[data.length - 1].totalPrice;
    }
    
    // Fallback to a default price if no data is available
    return 0.25; // Default mid-range price
  } catch (error) {
    console.error("Failed to get current price:", error);
    return 0.25; // Default mid-range price as fallback
  }
}

function getCurrentDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate mock data for testing or when the API fails
function generateMockPriceData(): PriceData[] {
  const now = new Date();
  const result: PriceData[] = [];
  
  // Generate data for the past 48 hours
  for (let i = 47; i >= 0; i--) {
    const timePoint = new Date(now.getTime() - (i * 60 * 60 * 1000));
    
    // Create some variation in prices
    const hour = timePoint.getHours();
    let basePrice = 0.20; // Base price
    
    // Higher during peak hours (8-10 and 18-21)
    if ((hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21)) {
      basePrice = 0.35 + Math.random() * 0.15; // 0.35-0.50
    } 
    // Medium during daylight hours
    else if (hour > 10 && hour < 18) {
      basePrice = 0.25 + Math.random() * 0.10; // 0.25-0.35
    } 
    // Low during night
    else {
      basePrice = 0.15 + Math.random() * 0.10; // 0.15-0.25
    }
    
    const marketPrice = basePrice * 0.60;
    const marketPriceTax = basePrice * 0.15;
    const sourcingMarkupPrice = basePrice * 0.15;
    const energyTaxPrice = basePrice * 0.10;
    
    const from = new Date(timePoint.getTime());
    const till = new Date(timePoint.getTime() + 60 * 60 * 1000);
    
    result.push({
      from: from.toISOString(),
      till: till.toISOString(),
      marketPrice,
      marketPriceTax,
      sourcingMarkupPrice,
      energyTaxPrice,
      perUnit: "kWh",
      totalPrice: marketPrice + marketPriceTax + sourcingMarkupPrice + energyTaxPrice
    });
  }
  
  return result;
}
