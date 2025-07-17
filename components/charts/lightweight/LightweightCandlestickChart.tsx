import React, { useRef, useEffect } from 'react';
import { createChart, CandlestickData, CandlestickSeries, IChartApi } from 'lightweight-charts';
import { StockDataItem } from '@/types';

interface Props {
  data: StockDataItem[];
}

/**
 * 날짜 형식을 변환하는 함수
 * 2024/11/05 -> 2024-11-05
 */
const formatDate = (dateString: string): string => {
  return dateString.replace(/\//g, '-');
};

/**
 * Lightweight-charts를 사용한 캔들스틱 차트 컴포넌트
 * - 실시간으로 데이터 업데이트 및 렌더링
 * - 사용자가 차트를 확대/축소하고 드래그할 수 있음
 * - 툴팁을 통해 각 데이터 포인트의 상세 정보(시가, 고가, 저가, 종가)를 확인
 * @param {Props} props - data (차트 데이터)
 * @returns {JSX.Element}
 */
const LightweightCandlestickChart: React.FC<Props> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // 차트 초기화
    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#111827' }, textColor: '#9CA3AF' },
      grid: { vertLines: { color: '#374151' }, horzLines: { color: '#374151' } },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: '#374151' },
      timeScale: { borderColor: '#374151', timeVisible: true, secondsVisible: false },
    });

    // 캔들스틱 시리즈 추가
    seriesRef.current = chartRef.current.addSeries(CandlestickSeries, {
      upColor: '#ef4444', // 상승 캔들 색상
      downColor: '#1d74d6', // 하락 캔들 색상
      borderDownColor: '#1d74d6',
      borderUpColor: '#ef4444',
      wickDownColor: '#9CA3AF',
      wickUpColor: '#9CA3AF',
    });

    // 툴팁 구독 설정
    chartRef.current.subscribeCrosshairMove((param) => {
      if (!param || !param.time || !param.seriesData || !tooltipRef.current || !param.point) {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none';
        return;
      }
      const priceData = param.seriesData.get(seriesRef.current!) as CandlestickData;
      if (!priceData || !priceData.open) return;

      tooltipRef.current.style.display = 'block';
      tooltipRef.current.style.left = param.point.x + 10 + 'px';
      tooltipRef.current.style.top = param.point.y + 10 + 'px';
      tooltipRef.current.innerHTML = `
        <div style="color: #fff; background: rgba(0,0,0,0.7); padding: 6px 10px; border-radius: 8px; font-size: 12px; min-width:120px;">
          <div><strong>일자:</strong> ${param.time}</div>
          <div>시작가: ${priceData.open}</div>
          <div>종가: ${priceData.close}</div>
        </div>
      `;
      // <div>상한가: ${priceData.high}</div>
      // <div>하한가: ${priceData.low}</div>
    });

    // 창 크기 조절 핸들러
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // 데이터가 변경될 때 차트 업데이트
  useEffect(() => {
    if (seriesRef.current && data) {
      const chartData: CandlestickData[] = data.map((item) => ({
        time: formatDate(item.date),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      seriesRef.current.setData(chartData);
    }
  }, [data]);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '400px', position: 'relative' }}>
      <div
        ref={tooltipRef}
        style={{ position: 'absolute', pointerEvents: 'none', display: 'none', zIndex: 10 }}
      />
    </div>
  );
};

export default LightweightCandlestickChart;
