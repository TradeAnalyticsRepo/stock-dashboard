'use client';

import React, { useRef, useEffect, useState } from 'react';
import { createChart, CandlestickData, UTCTimestamp, MouseEventParams, CandlestickSeries } from 'lightweight-charts';
import styled from 'styled-components';

const ChartContainer = styled.div`
  height: 150px;
  position: relative;
`;

const LightweightCandlestickChart = ({ data, initialSelectedTime = null, zoomPercentage = 100 }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [selectedTime, setSelectedTime] = useState(initialSelectedTime);

  // Chart creation and event handling effect
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 150,
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#d1d5db',
          width: 1,
          style: 0,
        },
        horzLine: {
          color: '#d1d5db',
          width: 1,
          style: 0,
        },
      },
      localization: {
        timeFormatter: (time) => {
          const date = new Date(time * 1000);
          const year = date.getFullYear().toString().slice(-2); // 연도의 마지막 2자리
          const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 월을 2자리로
          const day = date.getDate().toString().padStart(2, '0'); // 일을 2자리로
          return `${year}년 ${month} ${day}`;
        },
      },
    });
    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#dc2626',
      downColor: '#2563eb',
      borderDownColor: '#2563eb',
      borderUpColor: '#dc2626',
      wickDownColor: '#2563eb',
      wickUpColor: '#dc2626',
    });
    seriesRef.current = candlestickSeries;

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };
    window.addEventListener('resize', handleResize);

    const handleClick = (param) => {
      if (!param.time) return;
      const clickedTime = param.time;
      setSelectedTime((current) => (current === clickedTime ? null : clickedTime));
    };
    chart.subscribeClick(handleClick);

    return () => {
      chart.unsubscribeClick(handleClick);
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Data update effect
  useEffect(() => {
    if (!seriesRef.current || !chartRef.current || data.length === 0) return;

    const chartData = data.map((item) => {
      const time = new Date(item.date).getTime() / 1000;
      const dataPoint = {
        time,
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      };

      if (time === selectedTime) {
        dataPoint.color = '#eab308'; // Yellow for selected
        dataPoint.borderColor = '#eab308'; // Yellow for selected
      }
      return dataPoint;
    });

    seriesRef.current.setData(chartData);
    chartRef.current.timeScale().fitContent();
  }, [data, selectedTime]);

  // Zoom effect
  useEffect(() => {
    if (!chartRef.current) return;

    const timeScale = chartRef.current.timeScale();
    const defaultBarSpacing = 5; // You might need to adjust this default value
    const newBarSpacing = defaultBarSpacing * (zoomPercentage / 100);
    timeScale.applyOptions({
      barSpacing: newBarSpacing,
    });
  }, [zoomPercentage]);

  return <ChartContainer ref={chartContainerRef} />;
};

export default LightweightCandlestickChart;
