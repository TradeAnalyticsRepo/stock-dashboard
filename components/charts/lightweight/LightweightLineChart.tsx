'use client';

import React, { useRef, useEffect } from 'react';
import { createChart, LineData, IChartApi, UTCTimestamp, LineSeries } from 'lightweight-charts';
import styled from 'styled-components';

interface ShareholderData {
  date: string;
  value: number;
}

interface LightweightLineChartProps {
  chartName: string;
  data: ShareholderData[];
  color: string;
  yFormatter: (value: number) => string;
}

const ChartContainer = styled.div`
  height: 200px;
`;

const LightweightLineChart: React.FC<LightweightLineChartProps> = ({ chartName, data, color, yFormatter }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;

    const chart: IChartApi = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 200, // 높이를 200px로 고정
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
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
    });
    chartRef.current = chart;

    chart.priceScale('right').applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
      // @ts-ignore
      tickMarkFormatter: (price: number) => {
        return yFormatter(price);
      },
    });

    const lineSeries = (chart as any).addSeries(LineSeries, {
      color,
      lineWidth: 2,
      priceFormat: {
        type: 'price',
        precision: 0,
        minMove: 1,
      },
    });

    const chartData: LineData[] = data.map((item) => ({
      time: (new Date(item.date).getTime() / 1000) as UTCTimestamp,
      value: item.value,
    }));
    lineSeries.setData(chartData);

    chart.timeScale().fitContent();

    const handleResize = () => {
      chart.applyOptions({
        width: chartContainerRef.current?.clientWidth,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data, color, yFormatter]);

  return <ChartContainer ref={chartContainerRef} />;
};

export default LightweightLineChart;
