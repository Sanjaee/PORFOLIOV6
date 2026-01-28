"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, TrendingUp, TrendingDown } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import Image from "../skills/Image";

interface CryptoData {
  symbol: string;
  lastprice?: number;
  change?: number;
  percentage_change?: number;
  high?: number;
  low?: number;
  open?: number;
  previous?: number;
  volume?: number;
}

interface ChartDataPoint {
  time: string;
  value: number;
}

interface CryptoPrice {
  date: string;
  formatted_date: string;
  xlabel: string;
  value: string;
  percentage?: string;
}

interface CryptoChartData {
  prices: CryptoPrice[];
  change: number;
  percentage: string;
  previous: number;
  previous_timeframe_price?: CryptoPrice;
  timeframe: string;
}

interface CryptoResponse {
  success: boolean;
  data: {
    data: CryptoChartData;
    message: string;
  };
  message: string;
}

// Format date based on timeframe
const formatDateByTimeframe = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp);
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
const transformChartData = (prices: CryptoPrice[], timeframe: string = '1m'): ChartDataPoint[] => {
  if (!prices || !Array.isArray(prices) || prices.length === 0) return [];
  
  return prices.map((price) => {
    // Parse timestamp from date field (already in milliseconds)
    let timestamp: number;
    const dateStr = String(price.date);
    const numericValue = parseFloat(dateStr);
    
    // If it's a large number (likely timestamp in milliseconds)
    if (!isNaN(numericValue) && numericValue > 1000000000000) {
      timestamp = numericValue;
    } else if (!isNaN(numericValue) && numericValue > 1000000000) {
      timestamp = numericValue * 1000;
    } else {
      timestamp = Date.now();
    }
    
    // Parse value - handle string format
    let value = 0;
    if (typeof price.value === 'string') {
      value = parseFloat(price.value.replace(/[^\d.-]/g, '')) || 0;
    } else if (typeof price.value === 'number') {
      value = price.value;
    }
    
    const time = formatDateByTimeframe(timestamp, timeframe);
    
    return {
      time: time || price.formatted_date || 'N/A',
      value: isNaN(value) ? 0 : value,
    };
  }).filter(item => item.value > 0); // Filter out invalid data points
};

const chartConfig = {
  value: {
    label: "Price",
    color: "hsl(142, 76%, 36%)",
  },
};

const timeRanges = ["1D", "1W", "1M", "3M", "YTD", "1Y", "3Y", "5Y"];

export default function CryptoPage() {
  const symbol = "BTC"; // Fixed to BTC only
  const [data, setData] = useState<CryptoData | null>(null);
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

  const fetchChartData = useCallback(async (timeframe: string, showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setChartLoading(true);
        setLoading(true);
      }
      setError(null);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://meme-saham.vercel.app';
      // Convert timeframe to lowercase for API (1D -> 1d, 3Y -> 3y)
      const apiTimeframe = timeframe.toLowerCase();
      const response = await axios.get<CryptoResponse>(
        `${backendUrl}/api/crypto/candlestick/${symbol}`,
        {
          params: {
            timeframe: apiTimeframe,
          }
        }
      );

      if (response.data.success && response.data.data?.data?.prices) {
        const chartData = response.data.data.data;
        // Use uppercase timeframe for display formatting
        const transformedData = transformChartData(chartData.prices, timeframe.toUpperCase());
        setChartData(transformedData);
        
        // Extract price data from API response
        if (transformedData.length > 0) {
          const latest = transformedData[transformedData.length - 1];
          
          setData({
            symbol: symbol,
            lastprice: latest.value,
            change: chartData.change || 0,
            percentage_change: parseFloat(chartData.percentage) || 0,
            high: Math.max(...transformedData.map(d => d.value)),
            low: Math.min(...transformedData.map(d => d.value)),
            open: transformedData[0]?.value || 0,
            previous: chartData.previous || 0,
          });
        }
      } else {
        console.warn("No chart data available, using empty array");
        setChartData([]);
      }
    } catch (err: any) {
      console.error("Error fetching chart data:", err);
      setError(err.response?.data?.message || err.message || "Failed to fetch data");
      setChartData([]);
    } finally {
      if (showLoading) {
        setChartLoading(false);
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchChartData(selectedRange);
  }, [selectedRange, fetchChartData]);

  // Auto-refresh data every second for crypto (without showing loading)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchChartData(selectedRange, false); // Don't show loading on auto-refresh
    }, 1000); // Refresh every 1 second

    // Cleanup interval on unmount or when selectedRange changes
    return () => clearInterval(interval);
  }, [selectedRange, fetchChartData]);

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + " T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + " B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + " M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + " K";
    return num.toFixed(2);
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
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-500">Error: {error || "No data available"}</p>
          <Button onClick={() => fetchChartData(selectedRange)} className="mt-4">
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  const cryptoData = data;
  const isPositive = (cryptoData.change || 0) >= 0;
  const changeColor = isPositive ? "text-green-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 mt-14">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image src="/BTC.png" alt="Crypto" width={48} height={48} />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{symbol}</h1>
                </div>
                <p className="text-sm text-muted-foreground">Cryptocurrency</p>
              </div>
            </div>
          </div>

          {/* Price and Change */}
          <div className="flex flex-col mb-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold">
                ${cryptoData.lastprice?.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}
              </span>
              <div className={`flex items-center gap-1 ${changeColor}`}>
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="text-xl font-semibold">
                  {isPositive ? "+" : ""}
                  {cryptoData.change?.toFixed(2) || "0.00"} ({isPositive ? "+" : ""}
                  {cryptoData.percentage_change?.toFixed(2) || "0.00"}%)
                </span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Today {new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
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
                    // Only show label if this is the first occurrence (prevent looping/duplicates)
                    if (!uniqueLabelPositions.has(index)) {
                      return ''; // Hide duplicate labels
                    }
                    return value;
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
        {cryptoData.high && cryptoData.low && cryptoData.open && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Open</div>
              <div className="text-lg font-semibold">
                ${cryptoData.open.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">High</div>
              <div className="text-lg font-semibold">
                ${cryptoData.high.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Low</div>
              <div className="text-lg font-semibold">
                ${cryptoData.low.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-sm text-muted-foreground mb-1">Previous</div>
              <div className="text-lg font-semibold">
                ${cryptoData.previous?.toLocaleString("en-US", { minimumFractionDigits: 2 }) || "0.00"}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
