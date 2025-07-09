'use client';

import React, { useEffect } from 'react';
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
      ? `display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;
        @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
        @media (min-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      `
      : props.flex
      ? `display: flex; gap: 0.5rem; margin-bottom: 1.5rem;`
      : ''}
`;
const Card = styled.div`
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #27272a;
`;
const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
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
const StockDashboardLightweight = ({ stockName }: { stockName?: string | null }) => {
  const { isClient, stockData, institutionalData, selectedPeriod, setSelectedPeriod, priceChangePercent, currentPrice } = useStockData('1Y');

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

  const latestIndividualVolume = getLatestValue(institutionalData.개인);
  const latestForeignerVolume = getLatestValue(institutionalData.외국인);
  const latestCombinedForcesVolume = getLatestValue(institutionalData.세력합);

  return (
    <Wrapper>
      <Header
        chartType='lightweight'
        stockName={stockName}
      />
      <Main>
        <Section grid>
          <StatCard
            title='현재가'
            value={`₩${currentPrice.toLocaleString()}`}
            change={priceChangePercent}
            icon={Activity}
            color='text-red-600'
          />
          <StatCard
            title='개인 매집수량'
            value={latestIndividualVolume.toLocaleString()}
            icon={Users}
            color='text-blue-500'
          />
          <StatCard
            title='외국인 매집수량'
            value={latestForeignerVolume.toLocaleString()}
            icon={Globe}
            color='text-green-500'
          />
          <StatCard
            title='세력합 매집수량'
            value={latestCombinedForcesVolume.toLocaleString()}
            icon={Building}
            color='text-purple-500'
          />
        </Section>
        <Section flex>
          {PERIODS.map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
        </Section>
        <Section grid>
          <Card style={{ gridColumn: 'span 2' }}>
            <ChartTitle>
              <Activity style={{ color: '#dc2626', marginRight: 8 }} />
              주가 차트 (캔들스틱)
            </ChartTitle>
            <LightweightCandlestickChart data={stockData} />
          </Card>
          <div style={{ gridColumn: 'span 2' }}>
            <AveragePriceCard
              data={stockData}
              period={selectedPeriod}
            />
          </div>
          {Object.keys(institutionalData).map((key) => (
            <Card key={key}>
              <ChartTitle>
                <Users style={{ color: LINE_CHART_COLORS[key], marginRight: 8 }} />
                {key} 매집수량
              </ChartTitle>
              <LightweightLineChart
                chartName={key}
                data={institutionalData[key]}
                color={LINE_CHART_COLORS[key] || '#ffffff'}
                yFormatter={(v) => v.toLocaleString()}
              />
            </Card>
          ))}
        </Section>
      </Main>
    </Wrapper>
  );
};

export default StockDashboardLightweight;
