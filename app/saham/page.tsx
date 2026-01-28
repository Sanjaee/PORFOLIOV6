"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "../skills/Image";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown, Plus } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface StockbitData {
  symbol: string;
  name: string;
  lastprice: number;
  change: number;
  percentage_change: number;
  high: number;
  low: number;
  open: number;
  previous: number;
  volume: number;
  value: number;
  up: string;
  down: string;
  unchanged: string;
  frequency: number;
  country: string;
  exchange: string;
}

interface StockbitResponse {
  success: boolean;
  data: {
    data: StockbitData;
    message: string;
  };
  message: string;
}

interface ChartDataPoint {
  time: string;
  value: number;
}

interface ChartPrice {
  date: string;
  formatted_date?: string;
  xlabel?: string;
  value: number | string;
  percentage?: string;
  change?: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

interface ChartResponse {
  success: boolean;
  data: {
    data: {
      prices: ChartPrice[];
      timeframe: string;
    };
    message: string;
  };
  message: string;
}

// Format date based on timeframe
const formatDateByTimeframe = (date: Date, timeframe: string): string => {
  const timeframeUpper = timeframe.toUpperCase();
  
  // 1D: Show time (HH:MM)
  if (timeframeUpper === '1D') {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }
  
  // 1W, 1M: Show date (DD MMM) - e.g., "19 Dec", "06 Jan"
  if (timeframeUpper === '1W' || timeframeUpper === '1M') {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${day} ${month}`;
  }
  
  // 3M, YTD, 1Y: Show month (MMM) - e.g., "Feb", "Mar", "Apr"
  if (timeframeUpper === '3M' || timeframeUpper === 'YTD' || timeframeUpper === '1Y') {
    return date.toLocaleDateString('en-US', { 
      month: 'short' 
    });
  }
  
  // 3Y, 5Y: Show year (YYYY) - e.g., "2024", "2025", "2026"
  if (timeframeUpper === '3Y' || timeframeUpper === '5Y') {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric' 
    });
  }
  
  // Default: Show date (DD MMM)
  const day = date.getDate().toString().padStart(2, '0');
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  return `${day} ${month}`;
};

// Transform chart data from API to chart format
const transformChartData = (prices: ChartPrice[], timeframe: string = '1D'): ChartDataPoint[] => {
  if (!prices || prices.length === 0) return [];
  const timeframeUpper = timeframe.toUpperCase();
  const isDaily = timeframeUpper === '1D';
  // For 1Y, 3Y, 5Y - always use our format, ignore xlabel to prevent looping
  const useCustomFormat = isDaily || timeframeUpper === '1Y' || timeframeUpper === '3Y' || timeframeUpper === '5Y';
  
  return prices.map((price) => {
    let time = '';
    
    // For 1D, 1Y, 3Y, 5Y timeframes, always format from date, ignore xlabel
    if (useCustomFormat && price.date) {
      try {
        let date: Date;
        const dateStr = String(price.date);
        const numericValue = parseFloat(dateStr);
        
        // If it's a large number (likely timestamp in milliseconds)
        if (!isNaN(numericValue) && numericValue > 1000000000000) {
          date = new Date(numericValue);
        } else if (!isNaN(numericValue) && numericValue > 1000000000) {
          date = new Date(numericValue * 1000);
        } else {
          date = new Date(price.date);
        }
        
        if (!isNaN(date.getTime())) {
          time = formatDateByTimeframe(date, timeframe);
        } else {
          // Fallback only if date parsing fails
          time = price.xlabel || price.formatted_date || String(price.date);
        }
      } catch (e) {
        // Fallback only if date parsing fails
        time = price.xlabel || price.formatted_date || String(price.date);
      }
    } else {
      // For other timeframes (1W, 1M, 3M, YTD), prioritize xlabel if available
      if (price.xlabel) {
        time = price.xlabel;
      } else if (price.formatted_date) {
        time = price.formatted_date;
      } else if (price.date) {
        // Parse date and format based on timeframe
        try {
          let date: Date;
          const dateStr = String(price.date);
          const numericValue = parseFloat(dateStr);
          
          if (!isNaN(numericValue) && numericValue > 1000000000000) {
            date = new Date(numericValue);
          } else if (!isNaN(numericValue) && numericValue > 1000000000) {
            date = new Date(numericValue * 1000);
          } else {
            date = new Date(price.date);
          }
          
          if (isNaN(date.getTime())) {
            time = String(price.date);
          } else {
            time = formatDateByTimeframe(date, timeframe);
          }
        } catch (e) {
          time = String(price.date);
        }
      }
    }
    
    // Parse value - handle both string and number
    let value = 0;
    if (typeof price.value === 'string') {
      value = parseFloat(price.value.replace(/[^\d.-]/g, '')) || 0;
    } else if (typeof price.value === 'number') {
      value = price.value;
    }
    
    return {
      time: time || 'N/A',
      value: isNaN(value) ? 0 : value,
    };
  }).filter(item => item.value > 0); // Filter out invalid data points
};

const chartConfig = {
  value: {
    label: "IHSG",
    color: "hsl(142, 76%, 36%)",
  },
};

const timeRanges = ["1D", "1W", "1M", "3M", "YTD", "1Y", "3Y", "5Y"];

export default function SahamPage() {
  const [data, setData] = useState<StockbitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState("1D");
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  
  // Calculate unique label positions to prevent looping/duplicates
  const uniqueLabelPositions = useMemo(() => {
    const seen = new Set<string>();
    const positions = new Set<number>();
    
    chartData.forEach((item, index) => {
      if (!seen.has(item.time)) {
        seen.add(item.time);
        positions.add(index);
      }
    });
    
    return positions;
  }, [chartData]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchChartData(selectedRange);
  }, [selectedRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app';
      const response = await axios.get<StockbitResponse>(
        `${backendUrl}/api/ihsg/orderbook/IHSG`
      );

      if (response.data.success && response.data.data?.data) {
        // Extract the actual stock data
        setData(response.data.data.data);
      } else {
        throw new Error(response.data.message || "Invalid response format");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch data");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (timeframe: string) => {
    try {
      setChartLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app';
      const response = await axios.get<ChartResponse>(
        `${backendUrl}/api/ihsg/chart/IHSG`,
        {
          params: {
            timeframe: timeframe.toLowerCase(),
            is_include_previous_historical: true
          }
        }
      );

      if (response.data.success && response.data.data?.data?.prices) {
        const transformedData = transformChartData(response.data.data.data.prices, timeframe);
        setChartData(transformedData);
      } else {
        console.warn("No chart data available, using empty array");
        setChartData([]);
      }
    } catch (err: any) {
      console.error("Error fetching chart data:", err);
      // Don't set error state for chart, just log it
      setChartData([]);
    } finally {
      setChartLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + " T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + " M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + " K";
    return num.toFixed(2);
  };

  const formatVolume = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + " M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + " K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section Skeleton */}
          <div className="mb-6 mt-14">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Logo Skeleton */}
                <div className="w-12 h-12 rounded-full bg-muted animate-pulse" />
                <div>
                  {/* Symbol Skeleton */}
                  <div className="h-7 w-20 bg-muted animate-pulse rounded mb-2" />
                  {/* Name Skeleton */}
                  <div className="h-4 w-48 bg-muted animate-pulse rounded" />
                </div>
              </div>
            </div>

            {/* Price and Change Skeleton */}
            <div className="flex flex-col mb-2">
              <div className="flex items-baseline gap-3">
                {/* Price Skeleton */}
                <div className="h-10 w-40 bg-muted animate-pulse rounded" />
                {/* Change Skeleton */}
                <div className="h-6 w-32 bg-muted animate-pulse rounded" />
              </div>
              {/* Timestamp Skeleton */}
              <div className="h-4 w-32 bg-muted animate-pulse rounded mt-1" />
            </div>

            {/* Volume Info Skeleton */}
            <div className="flex gap-6 text-sm">
              <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              <div className="h-4 w-28 bg-muted animate-pulse rounded" />
            </div>
          </div>

          {/* Chart Section Skeleton */}
          <Card className="p-6">
            {/* Time Range Selector Skeleton */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {timeRanges.map((range) => (
                <div
                  key={range}
                  className="h-8 w-12 bg-muted animate-pulse rounded"
                />
              ))}
            </div>

            {/* Chart Skeleton */}
            <div className="h-[400px] w-full bg-muted animate-pulse rounded" />
          </Card>

          {/* Additional Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <div className="h-4 w-16 bg-muted animate-pulse rounded mb-2" />
                <div className="h-6 w-24 bg-muted animate-pulse rounded" />
              </Card>
            ))}
          </div>

          {/* Market Stats Skeleton */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4">
                <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
                <div className="h-6 w-16 bg-muted animate-pulse rounded" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-500">Error: {error || "No data available"}</p>
          <Button onClick={fetchData} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const stockData = data;
  const isPositive = stockData.change >= 0;
  const changeColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 mt-14">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image
                src="/ihsg.png"
                alt="IHSG"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{stockData.symbol}</h1>
                  <span className="text-sm">🇮🇩</span>
                </div>
                <p className="text-sm text-muted-foreground">{stockData.name}</p>
              </div>
            </div>
          
          </div>

          {/* Price and Change */}
          <div className="flex flex-col mb-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">{stockData.lastprice.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <div className={`flex items-center gap-1 ${changeColor}`}>
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="text-xl font-semibold">
                  {isPositive ? "+" : ""}
                  {stockData.change.toFixed(2)} ({isPositive ? "+" : ""}
                  {stockData.percentage_change.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Today Mon {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
            </div>
          </div>

          {/* Volume Info */}
          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Volume: </span>
              <span className="font-semibold">{formatVolume(stockData.volume)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Avg volume: </span>
              <span className="font-semibold">17.44 B</span>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <Card className="p-6">
          {/* Time Range Selector */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {timeRanges.map((range) => (
              <Button
                key={range}
                variant={selectedRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>

          {/* Chart */}
          {chartLoading ? (
            <div className="h-[400px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : chartData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="time"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  angle={selectedRange === '1D' ? 0 : -45}
                  textAnchor={selectedRange === '1D' ? 'middle' : 'end'}
                  height={60}
                  tickFormatter={(value, index) => {
                    // If value is still a timestamp (numeric string), format it
                    let formattedValue = String(value);
                    const numValue = parseFloat(formattedValue);
                    if (!isNaN(numValue) && numValue > 1000000000000) {
                      // It's a timestamp in milliseconds
                      const date = new Date(numValue);
                      formattedValue = formatDateByTimeframe(date, selectedRange);
                    }
                    
                    // Only show label if this is the first occurrence (prevent looping/duplicates)
                    // Jan, Jan, Jan -> Jan only (show first occurrence only)
                    if (!uniqueLabelPositions.has(index)) {
                      return ''; // Hide duplicate labels
                    }
                    
                    return formattedValue;
                  }}
                  interval={0}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  className="text-xs"
                  domain={["dataMin - 50", "dataMax + 50"]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ChartContainer>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              No chart data available
            </div>
          )}
        </Card>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Open</div>
            <div className="text-lg font-semibold">{stockData.open.toLocaleString("id-ID", { minimumFractionDigits: 2 })}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">High</div>
            <div className="text-lg font-semibold">{stockData.high.toLocaleString("id-ID", { minimumFractionDigits: 2 })}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Low</div>
            <div className="text-lg font-semibold">{stockData.low.toLocaleString("id-ID", { minimumFractionDigits: 2 })}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Previous</div>
            <div className="text-lg font-semibold">{stockData.previous.toLocaleString("id-ID", { minimumFractionDigits: 2 })}</div>
          </Card>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Up</div>
            <div className="text-lg font-semibold text-green-500">{stockData.up}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Down</div>
            <div className="text-lg font-semibold text-red-500">{stockData.down}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">Unchanged</div>
            <div className="text-lg font-semibold">{stockData.unchanged}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
