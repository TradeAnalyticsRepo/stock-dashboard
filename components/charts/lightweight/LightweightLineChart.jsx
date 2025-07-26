"use client";

import React, { useRef, useEffect } from "react";
import { createChart, LineData, LineSeries, UTCTimestamp } from "lightweight-charts";
import styled from "styled-components";

const ChartContainer = styled.div`
  height: 100px;
`;

const LightweightLineChart = ({ chartName, data, color, yFormatter }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 100, // 높이를 200px로 고정
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
      },
      rightPriceScale: {
        borderColor: "#27272a",
      },
    });
    chartRef.current = chart;

    chart.priceScale("right").applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      tickMarkFormatter: (price) => {
        return yFormatter(price);
      },
    });

    const lineSeries = chart.addSeries(LineSeries, {
      color,
      lineWidth: 2,
      priceFormat: {
        type: "price",
        precision: 0,
        minMove: 1,
      },
    });

    const chartData = data.map((item) => ({
      time: new Date(item.date).getTime() / 1000,
      value: item.value,
    }));
    lineSeries.setData(chartData);

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
  }, [data, color, yFormatter]);

  return <ChartContainer ref={chartContainerRef} />;
};

export default LightweightLineChart;
