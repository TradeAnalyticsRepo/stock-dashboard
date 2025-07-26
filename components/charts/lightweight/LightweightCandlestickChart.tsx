"use client";

import React, { useRef, useEffect, useState } from "react";
import { createChart, CandlestickData, UTCTimestamp, MouseEventParams, IChartApi, ISeriesApi, CandlestickSeries } from "lightweight-charts";
import { StockDataItem } from "@/types";
import styled from "styled-components";

const ChartContainer = styled.div`
  height: 150px;
  position: relative;
`;

interface LightweightCandlestickChartProps {
  data: StockDataItem[];
  initialSelectedTime?: UTCTimestamp | null;
}

const LightweightCandlestickChart: React.FC<LightweightCandlestickChartProps> = ({ data, initialSelectedTime = null }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [selectedTime, setSelectedTime] = useState<UTCTimestamp | null>(initialSelectedTime);

  // Chart creation and event handling effect
  useEffect(() => {
    if (!chartContainerRef.current) return;

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
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#dc2626",
      downColor: "#2563eb",
      borderDownColor: "#2563eb",
      borderUpColor: "#dc2626",
      wickDownColor: "#2563eb",
      wickUpColor: "#dc2626",
    });
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };
    window.addEventListener("resize", handleResize);

    const handleClick = (param: MouseEventParams) => {
      if (!param.time) return;
      const clickedTime = param.time as UTCTimestamp;
      setSelectedTime((current) => (current === clickedTime ? null : clickedTime));
    };
    chart.subscribeClick(handleClick);

    return () => {
      chart.unsubscribeClick(handleClick);
      window.removeEventListener("resize", handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Data update effect
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || data.length === 0) return;

    const chartData = data.map((item) => {
      const time = (new Date(item.date).getTime() / 1000) as UTCTimestamp;
      const dataPoint: CandlestickData & { color?: string } = {
        time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      };

      if (item?.color) {
        dataPoint.color = item.color;
      }

      if (time === selectedTime) {
        dataPoint.color = "#eab308"; // Yellow for selected
        dataPoint.borderColor = "#eab308"; // Yellow for selected
      }
      4;
      return dataPoint;
    });

    seriesRef.current.setData(chartData);
    chartRef.current.timeScale().fitContent();
  }, [data, selectedTime]);

  return <ChartContainer ref={chartContainerRef} />;
};

export default LightweightCandlestickChart;
