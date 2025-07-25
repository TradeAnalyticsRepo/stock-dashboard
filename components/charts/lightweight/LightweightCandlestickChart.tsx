"use client";

import React, { useRef, useEffect } from "react";
import { createChart, CandlestickData, IChartApi, UTCTimestamp, CandlestickSeries } from "lightweight-charts";
import { StockDataItem } from "@/types";
import styled from "styled-components";

const ChartContainer = styled.div`
  height: 150px;
  position: relative;
`;

interface LightweightCandlestickChartProps {
  data: StockDataItem[];
}

const LightweightCandlestickChart: React.FC<LightweightCandlestickChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 150,
      layout: {
        background: { color: "#1a1a1a" },
        textColor: "#d1d5db",
      },
      grid: {
        vertLines: { color: "#27272a" },
        horzLines: { color: "#27272a" },
      },
      timeScale: {
        borderColor: "#27272a",
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
    });

    // 원래대로 addCandlestickSeries 사용
    const candlestickSeries = (chart as any).addSeries(CandlestickSeries, {
      upColor: "#dc2626",
      downColor: "#2563eb",
      borderDownColor: "#2563eb",
      borderUpColor: "#dc2626",
      wickDownColor: "#2563eb",
      wickUpColor: "#dc2626",
    });

    const chartData: CandlestickData[] = data.map((item) => ({
      time: (new Date(item.date).getTime() / 1000) as UTCTimestamp,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));
    candlestickSeries.setData(chartData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data]);

  return <ChartContainer ref={chartContainerRef} />;
};

export default LightweightCandlestickChart;
