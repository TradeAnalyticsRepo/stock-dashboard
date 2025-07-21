'use client';

import React, { useEffect, useState } from 'react';
import { Activity, Users, Globe, Building } from 'lucide-react';
import Header from '@/components/Header';
import StatCard from '@/components/ui/StatCard';
import PeriodButton from '@/components/ui/PeriodButton';
import AveragePriceCard from '@/components/ui/AveragePriceCard';
import LightweightCandlestickChart from '@/components/charts/lightweight/LightweightCandlestickChart';
import LightweightLineChart from '@/components/charts/lightweight/LightweightLineChart';
import { useStockData } from '@/components/hooks/useStockData';
import { LINE_CHART_COLORS, PERIODS } from '@/types/constants';
import styled from 'styled-components';
import Accordion from '@/components/ui/Accordion';

const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;
const Main = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
`;
// Section: grid, flex prop이 DOM에 전달되지 않도록 withConfig 사용
const Section = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== 'grid' && prop !== 'flex', // grid, flex는 스타일 계산에만 사용, DOM에는 전달하지 않음
})<{ grid?: boolean; flex?: boolean }>`
  ${(props) =>
    props.grid
      ? `display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem;`
      : props.flex
      ? `display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;`
      : ''}
`;
const Card = styled.div`
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #27272a;
`;
const ToggleButton = styled.button`
  background: #27272a;
  color: #fff;
  border: 1px solid #3f3f46;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: auto;

  &:hover {
    background: #3f3f46;
  }
`;
const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
`;
const FlexCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * Main component to display the stock dashboard using Lightweight-charts.
 * Manages data through the useStockData hook.
 * Includes key metrics, period selection buttons, and a chart grid.
 */
const StockDashboardLightweight = ({ stockName, allData }: { stockName?: string | null; allData: object[] }) => {
  const { isClient, stockData, institutionalData, selectedPeriod, setSelectedPeriod, priceChangePercent, currentPrice } = useStockData(
    '10Y',
    allData
  );
  const [showAveragePrice, setShowAveragePrice] = useState(false);

  useEffect(() => {
    console.log({
      isClient,
      stockData,
      institutionalData,
    });
  }, []);

  if (!isClient) {
    return (
      <Wrapper>
        <FlexCenter>로딩 중...</FlexCenter>
      </Wrapper>
    );
  }

  const getLatestValue = (data: { value: number }[]) => {
    if (data && data.length > 0) {
      return data[data.length - 1].value;
    }
    return 0;
  };

  // const latestIndividualVolume = getLatestValue(institutionalData.개인);
  // const latestForeignerVolume = getLatestValue(institutionalData.외국인);
  // const latestCombinedForcesVolume = getLatestValue(institutionalData.세력합);

  return (
    <Wrapper>
      <Header
        chartType='lightweight'
        stockName={stockName}
      />
      <Main>
        <Section flex>
          {PERIODS.map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
          <ToggleButton onClick={() => setShowAveragePrice((prev) => !prev)}>{showAveragePrice ? '평균값 숨기기' : '평균값 보기'}</ToggleButton>
        </Section>
        <Section grid>
          <Accordion
            defaultOpen
            title={
              <>
                <Activity style={{ color: '#dc2626', marginRight: 8 }} />
                주가 차트 (캔들스틱)
              </>
            }>
            <LightweightCandlestickChart data={stockData} />
          </Accordion>
          {showAveragePrice && (
            <Accordion
              defaultOpen
              title={
                <>
                  <Users style={{ color: '#f59e0b', marginRight: 8 }} />
                  주요기간 평균값
                </>
              }>
              <AveragePriceCard
                data={stockData}
                period={selectedPeriod}
              />
            </Accordion>
          )}
          {Object.keys(institutionalData).map((key) => (
            <Accordion
              key={key}
              defaultOpen
              title={
                <>
                  <Users style={{ color: LINE_CHART_COLORS[key], marginRight: 8 }} />
                  {key} 매집수량
                </>
              }>
              <LightweightLineChart
                chartName={key}
                data={institutionalData[key]}
                color={LINE_CHART_COLORS[key] || '#ffffff'}
                yFormatter={(v) => Math.round(v).toLocaleString()}
              />
            </Accordion>
          ))}
        </Section>
      </Main>
    </Wrapper>
  );
};

export default StockDashboardLightweight;

// <Section grid>
//   <StatCard
//     title='현재가'
//     value={`₩${currentPrice.toLocaleString()}`}
//     change={priceChangePercent}
//     icon={Activity}
//     color='text-red-600'
//   />
//   <StatCard
//     title='개인 매집수량'
//     value={latestIndividualVolume.toLocaleString()}
//     icon={Users}
//     color='text-blue-500'
//   />
//   <StatCard
//     title='외국인 매집수량'
//     value={latestForeignerVolume.toLocaleString()}
//     icon={Globe}
//     color='text-green-500'
//   />
//   <StatCard
//     title='세력합 매집수량'
//     value={latestCombinedForcesVolume.toLocaleString()}
//     icon={Building}
//     color='text-purple-500'
//   />
// </Section>
