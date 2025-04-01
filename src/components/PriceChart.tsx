
import { useState, useRef, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Brush
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceData } from "@/services/priceService";

type PriceChartProps = {
  data: PriceData[];
};

export default function PriceChart({ data }: PriceChartProps) {
  const isMobile = useIsMobile();
  const chartRef = useRef<HTMLDivElement>(null);
  const [brushStartIndex, setBrushStartIndex] = useState<number>(Math.max(0, data.length - 12));
  const [brushEndIndex, setBrushEndIndex] = useState<number>(data.length - 1);
  
  const getPriceColor = (price: number) => {
    if (price >= 0.40) return "#FF0000"; // Brighter red
    if (price >= 0.25) return "#FFA500"; // More orange-yellow
    return "#00CC00"; // Brighter green
  };

  const formatXAxis = (tickItem: string) => {
    const date = new Date(tickItem);
    return format(date, isMobile ? "HH:mm" : "HH:mm", { locale: nl });
  };

  const formatTooltipTime = (time: string) => {
    const date = new Date(time);
    return format(date, "EEEE d MMMM HH:mm", { locale: nl });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const price = payload[0].value;
      return (
        <div className="p-3 text-sm bg-background/80 dark:bg-background/90 backdrop-blur-sm border rounded-md shadow-md">
          <p className="font-medium">{formatTooltipTime(label)}</p>
          <p className="flex items-center mt-1">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: getPriceColor(price) }}
            />
            <span>{formatCurrency(price)}/kWh</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {price < averagePrice ? "Lager dan gemiddeld" : "Hoger dan gemiddeld"}
          </p>
        </div>
      );
    }
  
    return null;
  };

  const formatCurrency = (value: number) => {
    return `€${value.toFixed(2)}`;
  };

  // Find where actual data ends and prediction begins
  const now = new Date();
  const currentHour = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    now.getHours()
  );
  
  // Calculate average price
  const averagePrice = data.length
    ? data.reduce((total, item) => total + item.totalPrice, 0) / data.length
    : 0;

  // Handle brush change to update the view
  const handleBrushChange = (e: any) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      setBrushStartIndex(e.startIndex);
      setBrushEndIndex(e.endIndex);
    }
  };

  // Initialize brush with a default timeframe
  useEffect(() => {
    if (data.length) {
      // Default to showing the last 12 hours or less if fewer data points
      setBrushStartIndex(Math.max(0, data.length - 12));
      setBrushEndIndex(data.length - 1);
    }
  }, [data.length]);

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Prijsverloop</CardTitle>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Gemiddelde prijs: <span className="font-medium">{formatCurrency(averagePrice)}/kWh</span>
        </div>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="chart-container h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF0000" stopOpacity={0.6} />
                  <stop offset="33%" stopColor="#FFA500" stopOpacity={0.6} />
                  <stop offset="66%" stopColor="#00CC00" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#00CC00" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="from" 
                tickFormatter={formatXAxis}
                tickMargin={10}
                minTickGap={40}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                domain={[0.10, 0.60]} 
                ticks={[0.10, 0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60]}
                tickFormatter={(value) => `€${value.toFixed(2)}`}
                tickMargin={10}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine 
                y={averagePrice} 
                stroke="#555" 
                strokeDasharray="3 3"
                label={{
                  value: "Gemiddelde",
                  position: "insideTopRight",
                  fill: "#555",
                  fontSize: 10
                }}
              />
              <ReferenceLine 
                x={currentHour.toISOString()} 
                stroke="#555" 
                strokeDasharray="5 5"
                label={{
                  value: "Nu",
                  position: "insideTopLeft",
                  fill: "#555",
                  fontSize: 10
                }}
              />
              <Area
                type="monotone"
                dataKey="totalPrice"
                stroke="#0066FF"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
                isAnimationActive={true}
                animationDuration={1000}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  const date = new Date(payload.from);
                  const isPrediction = date > currentHour;
                  
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={4} 
                      fill={getPriceColor(payload.totalPrice)} 
                      stroke={isPrediction ? "#555" : "white"}
                      strokeWidth={isPrediction ? 2 : 1}
                      strokeDasharray={isPrediction ? "1 1" : "0"}
                    />
                  );
                }}
              />
              <Brush 
                dataKey="from" 
                height={30} 
                stroke="#8884d8" 
                tickFormatter={formatXAxis}
                startIndex={brushStartIndex}
                endIndex={brushEndIndex}
                onChange={handleBrushChange}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
