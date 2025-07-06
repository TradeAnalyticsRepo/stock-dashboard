import React, { useRef, useEffect } from "react";
import { createChart, LineData, LineSeries, IChartApi } from "lightweight-charts";

interface Props {
  data: { date: string; value: number }[];
  color: string;
  yFormatter?: (value: number) => string;
  height?: number;
}

/**
 * Lightweight-charts를 사용한 라인 차트 컴포넌트
 * - 주주 현황(개인, 외국인, 기관) 데이터를 시각화
 * - 동적인 데이터 업데이트와 부드러운 차트 렌더링을 지원
 * - 툴팁을 통해 각 데이터 포인트의 날짜와 값을 표시
 * @param {Props} props - data, color, yFormatter, height
 * @returns {JSX.Element}
 */
const LightweightLineChart: React.FC<Props> = ({ data, color, yFormatter, height = 320 }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<LineSeries | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 차트 초기화
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height,
      layout: { background: { color: "#111827" }, textColor: "#9CA3AF" },
      grid: { vertLines: { color: "#374151" }, horzLines: { color: "#374151" } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "#374151" },
      timeScale: { borderColor: "#374151", timeVisible: true, secondsVisible: false },
    });

    // 라인 시리즈 추가
    seriesRef.current = chartRef.current.addSeries(LineSeries, {
      color,
      lineWidth: 2,
    });

    // Y축 포맷터 적용
    if (yFormatter) {
      chartRef.current.priceScale("right").applyOptions({
        scaleMargins: { top: 0.1, bottom: 0.1 },
        entireTextOnly: true,
        // @ts-ignore
        tickMarkFormatter: (price: number) => yFormatter(price),
      });
    }

    // 툴팁 구독 설정
    chartRef.current.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData || !tooltipRef.current || !param.point) {
        if (tooltipRef.current) tooltipRef.current.style.display = "none";
        return;
      }
      const priceData = param.seriesData.get(seriesRef.current!);
      if (!priceData) return;

      tooltipRef.current.style.display = "block";
      tooltipRef.current.style.left = param.point.x + 10 + "px";
      tooltipRef.current.style.top = param.point.y + 10 + "px";
      tooltipRef.current.innerHTML = `
        <div style="color: #fff; background: rgba(0,0,0,0.7); padding: 6px 10px; border-radius: 8px; font-size: 12px; min-width:100px;">
          <div><strong>Date:</strong> ${param.time}</div>
          <div>Value: ${priceData.value}</div>
        </div>
      `;
    });

    // 창 크기 조절 핸들러
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [height, yFormatter]);

  // 데이터가 변경될 때 차트 업데이트
  useEffect(() => {
    if (seriesRef.current && data) {
      const chartData: LineData[] = data.map((item) => ({
        // test data
        time: `${item.date}`,
        value: item.value,
      }));
      seriesRef.current.setData(chartData);
    }
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: "100%", height: `${height}px`, position: "relative" }}>
      <div
        ref={tooltipRef}
        style={{ position: "absolute", pointerEvents: "none", display: "none", zIndex: 10 }}
      />
    </div>
  );
};

export default LightweightLineChart;
