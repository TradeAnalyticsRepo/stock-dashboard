'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Activity, Users, Settings } from 'lucide-react';
import Header from '../components/Header';
import LightweightCandlestickChart from '../components/charts/lightweight/LightweightCandlestickChart';
import LightweightLineChart from '../components/charts/lightweight/LightweightLineChart';
import { LINE_CHART_COLORS } from '../types/constants';
import styled from 'styled-components';
import Accordion from '../components/ui/Accordion.jsx';
import { useStockData } from '../components/hooks/useStockData';
import CustomDatePicker from './ui/CustomDatePicker';
import ChartSettingsModal from './ui/ChartSettingsModal';

// Styled Components
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
const ControlsSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;
const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    align-items: flex-start;
  }
`;
const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const SettingsButton = styled.button`
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
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  &:hover {
    background: #3f3f46;
  }
`;

const TableBtnBox = styled.div`
  position: absolute;
  left: 44%;

  ${SettingsButton} + ${SettingsButton} {
    margin-left : 1em;
  }
`;

const FlexCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SubTitle = styled.div`
  margin-left: auto;
  font-size: 11px;
  display: flex;
  > div + div {
    margin-left: 0.5rem;
  }
`;

const StockDashboardLightweight = ({ stockName, allData, lastestData }) => {
  const { isClient, stockData, institutionalData, dateRange, setDateRange } = useStockData(allData);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);

  const availableLineCharts = useMemo(() => Object.keys(institutionalData), [institutionalData]);
  const [selectedLineCharts, setSelectedLineCharts] = useState(availableLineCharts);

  // Create a stable, stringified version of the available charts for the useEffect dependency
  const stringifiedAvailableCharts = JSON.stringify(availableLineCharts);

  useEffect(() => {
    if (!stockName) return;
    const storageKey = `chartSettings-${stockName}`;
    const savedCharts = localStorage.getItem(storageKey);
    if (savedCharts) {
      setSelectedLineCharts(JSON.parse(savedCharts));
    } else {
      // Only set default if available charts are loaded
      if (availableLineCharts.length > 0) {
        setSelectedLineCharts(availableLineCharts);
      }
    }
  }, [stockName, stringifiedAvailableCharts]); // Depend on the stable string

  const openNewWindow = (dateRange) => {
    const url = dateRange ? `/periodTable?name=${stockName}&from=${dateRange.from}&to=${dateRange.to}` : `/table?name=${stockName}`;
    window.open(url, '_blank', `width=${window.innerWidth},height=${window.innerHeight}`);
  }

  const handleChartSelectionChange = (newSelectedCharts) => {
    setSelectedLineCharts(newSelectedCharts);
    if (stockName) {
      const storageKey = `chartSettings-${stockName}`;
      localStorage.setItem(storageKey, JSON.stringify(newSelectedCharts));
    }
  };

  const renderLineChart = (chartName) => {
    if (!institutionalData[chartName] || !lastestData[chartName]) return null;
    return (
      <Accordion key={chartName} defaultOpen title={<><Users style={{ color: LINE_CHART_COLORS[chartName], marginRight: 8, width: '15px', height: '15px' }} />{chartName}<SubTitle><div>현재보유량: {lastestData[chartName].collectionVolume.toLocaleString()}</div><div>분산비율: {lastestData[chartName].dispersionRatio}%</div><div>주가선도: {lastestData[chartName].stockMomentum}%</div><div>상관계수: {lastestData[chartName].stockCorrelation}</div></SubTitle></>}>
        <LightweightLineChart
          chartName={chartName}
          data={institutionalData[chartName]}
          color={LINE_CHART_COLORS[chartName] || '#ffffff'}
          yFormatter={(v) => Math.round(v).toLocaleString()}
        />
      </Accordion>
    );
  };

  if (!isClient) {
    return <Wrapper><FlexCenter>로딩 중...</FlexCenter></Wrapper>;
  }

  return (
    <Wrapper>
      <Header chartType='lightweight' stockName={stockName} />
      <Main>
        <ControlsSection>
          <CustomDatePicker onDateRangeChange={(from, to) => setDateRange({ from, to })} />
            <TableBtnBox>
              <SettingsButton onClick={() => openNewWindow(dateRange)}>
                기간 수급분석표
              </SettingsButton>
              <SettingsButton onClick={() => openNewWindow()}>
                수급분석표
              </SettingsButton>
            </TableBtnBox>
          <SettingsButton onClick={() => setSettingsModalOpen(true)}>
            <Settings size={16} />
            차트 설정
          </SettingsButton>
        </ControlsSection>

        <ChartGrid>
          <Column>
            <Accordion defaultOpen title={<><Activity style={{ color: '#dc2626', marginRight: 8, width: '15px', height: '15px' }} />주가 차트 (캔들스틱)</>}>
              <LightweightCandlestickChart data={stockData} />
            </Accordion>
            {selectedLineCharts.filter((_, index) => index % 2 === 0).map(renderLineChart)}
          </Column>

          <Column>
            <Accordion defaultOpen title={<><Activity style={{ color: '#dc2626', marginRight: 8, width: '15px', height: '15px' }} />주가 차트 (캔들스틱)</>}>
              <LightweightCandlestickChart data={stockData} />
            </Accordion>
            {selectedLineCharts.filter((_, index) => index % 2 === 1).map(renderLineChart)}
          </Column>
        </ChartGrid>
      </Main>

      <ChartSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        availableCharts={availableLineCharts}
        selectedCharts={selectedLineCharts}
        onChartSelectionChange={handleChartSelectionChange}
      />
    </Wrapper>
  );
};

export default StockDashboardLightweight;