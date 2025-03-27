
import { useState } from "react";
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
  YAxis
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PriceData } from "@/services/priceService";

type TimeRange = "1h" | "12h" | "24h" | "custom";

type PriceChartProps = {
  data: PriceData[];
};

export default function PriceChart({ data }: PriceChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const isMobile = useIsMobile();

  const filterDataByTimeRange = (range: TimeRange) => {
    const now = new Date();
    
    switch(range) {
      case "1h":
        const oneHourAgo = new Date(now.getTime() - (1 * 60 * 60 * 1000));
        return data.filter(item => new Date(item.from) >= oneHourAgo);
      case "12h":
        const twelveHoursAgo = new Date(now.getTime() - (12 * 60 * 60 * 1000));
        return data.filter(item => new Date(item.from) >= twelveHoursAgo);
      case "24h":
      default:
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        return data.filter(item => new Date(item.from) >= twentyFourHoursAgo);
    }
  };

  const filteredData = filterDataByTimeRange(timeRange);
  
  const getPriceColor = (price: number) => {
    if (price >= 0.40) return "#FF3B30";
    if (price >= 0.25) return "#FFCC00";
    return "#34C759";
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
        <div className="p-3 text-sm">
          <p className="font-medium">{formatTooltipTime(label)}</p>
          <p className="flex items-center mt-1">
            <span 
              className="inline-block w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: getPriceColor(price) }}
            />
            <span>{formatCurrency(price)}/kWh</span>
          </p>
        </div>
      );
    }
  
    return null;
  };

  const formatCurrency = (value: number) => {
    return `€${value.toFixed(2)}`;
  };

  // Calculate average price
  const averagePrice = data.length
    ? data.reduce((total, item) => total + item.totalPrice, 0) / data.length
    : 0;

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Prijsverloop</CardTitle>
          <div className="flex space-x-1">
            <Button 
              variant={timeRange === "1h" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("1h")}
              className="text-xs h-8"
            >
              1u
            </Button>
            <Button 
              variant={timeRange === "12h" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("12h")}
              className="text-xs h-8"
            >
              12u
            </Button>
            <Button 
              variant={timeRange === "24h" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setTimeRange("24h")}
              className="text-xs h-8"
            >
              24u
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Gemiddelde prijs: <span className="font-medium">{formatCurrency(averagePrice)}/kWh</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066FF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
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
                domain={[0.15, 0.60]} 
                ticks={[0.15, 0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60]}
                tickFormatter={(value) => `€${value.toFixed(2)}`}
                tickMargin={10}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <Tooltip content={<CustomTooltip />} />
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
                  return (
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={4} 
                      fill={getPriceColor(payload.totalPrice)} 
                      stroke="white" 
                      strokeWidth={1} 
                    />
                  );
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
