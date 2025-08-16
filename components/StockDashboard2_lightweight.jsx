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
import Memo from './ui/Memo';

// Styled Components
const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;
const Main = styled.main`
  max-width: 110rem;
  margin: 0 auto;
  padding: 1.5rem;
`;
const ControlsSection = styled.section`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: space-between;
`;
const PeriodButton = styled.button`
  background: #27272a;
  color: #fff;
  border: 1px solid #3f3f46;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #3f3f46;
    border-color: #52525b;
  }
  &:active {
    background: #52525b;
  }
`;
const DatePickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
`;
const RightControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;
const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: 1280px) {
    grid-template-columns: 1fr 1fr 320px; /* Two columns for charts, one for memo */
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
  display: flex;
  gap: 0.5rem;

  ${SettingsButton} + ${SettingsButton} {
    margin-left: 0;
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
  const [memo, setMemo] = useState('');
  const [zoomPercentage, setZoomPercentage] = useState(100); // Default to 100% zoom

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

    const memoKey = `memo-${stockName}`;
    const savedMemo = localStorage.getItem(memoKey);
    if (savedMemo) {
      setMemo(savedMemo);
    }
  }, [stockName, stringifiedAvailableCharts]); // Depend on the stable string

  const openNewWindow = (dateRange) => {
    const url = dateRange ? `/periodTable?name=${stockName}&from=${dateRange.from}&to=${dateRange.to}` : `/table?name=${stockName}`;
    window.open(url, '_blank', `width=${window.innerWidth},height=${window.innerHeight}`);
  };

  const handleChartSelectionChange = (newSelectedCharts) => {
    setSelectedLineCharts(newSelectedCharts);
    if (stockName) {
      const storageKey = `chartSettings-${stockName}`;
      localStorage.setItem(storageKey, JSON.stringify(newSelectedCharts));
    }
  };

  const handleSaveMemo = (newMemo) => {
    setMemo(newMemo);
    if (stockName) {
      const memoKey = `memo-${stockName}`;
      localStorage.setItem(memoKey, newMemo);
    }
  };

  const setPeriod = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setDateRange({ from, to });
  };

  const renderLineChart = (chartName) => {
    if (!institutionalData[chartName] || !lastestData[chartName]) return null;
    return (
      <Accordion
        key={chartName}
        defaultOpen
        title={
          <>
            <Users style={{ color: LINE_CHART_COLORS[chartName], marginRight: 8, width: '15px', height: '15px' }} />
            {chartName}
            <SubTitle>
              <div>현재보유량: {lastestData[chartName].collectionVolume.toLocaleString()}</div>
              <div>분산비율: {lastestData[chartName].dispersionRatio}%</div>
              <div>주가선도: {lastestData[chartName].stockMomentum}%</div>
              <div>상관계수: {lastestData[chartName].stockCorrelation}</div>
            </SubTitle>
          </>
        }>
        <LightweightLineChart
          chartName={chartName}
          data={institutionalData[chartName]}
          color={LINE_CHART_COLORS[chartName] || '#ffffff'}
          yFormatter={(v) => Math.round(v).toLocaleString()}
          zoomPercentage={zoomPercentage}
        />
      </Accordion>
    );
  };

  if (!isClient) {
    return (
      <Wrapper>
        <FlexCenter>로딩 중...</FlexCenter>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Header
        chartType='lightweight'
        stockName={stockName}
      />
      <Main>
        <ControlsSection>
          <DatePickerContainer>
            <CustomDatePicker
              onDateRangeChange={(from, to) => setDateRange({ from, to })}
              startDate={dateRange.from?.toISOString().split('T')[0]}
              endDate={dateRange.to?.toISOString().split('T')[0]}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#a3a3a3', marginBottom: '0.25rem' }}>간편 기간 설정</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <PeriodButton onClick={() => setPeriod(30)}>1개월</PeriodButton>
                <PeriodButton onClick={() => setPeriod(90)}>3개월</PeriodButton>
                <PeriodButton onClick={() => setPeriod(180)}>6개월</PeriodButton>
                <PeriodButton onClick={() => setPeriod(365)}>1년</PeriodButton>
                <PeriodButton onClick={() => setPeriod(730)}>2년</PeriodButton>
                <PeriodButton onClick={() => setPeriod(1095)}>3년</PeriodButton>
                <PeriodButton onClick={() => setPeriod(3650)}>10년</PeriodButton>
              </div>
            </div>
          </DatePickerContainer>
          <RightControls>
            <TableBtnBox>
              <SettingsButton onClick={() => openNewWindow(dateRange)}>기간 수급분석표</SettingsButton>
              <SettingsButton onClick={() => openNewWindow()}>수급분석표</SettingsButton>
            </TableBtnBox>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type='number'
                placeholder='Zoom %'
                value={zoomPercentage}
                onChange={(e) => setZoomPercentage(e.target.value)}
                style={{
                  background: '#27272a',
                  color: '#fff',
                  border: '1px solid #3f3f46',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  width: '80px',
                }}
              />
              <SettingsButton onClick={() => setSettingsModalOpen(true)}>
                <Settings size={16} />
                차트 설정
              </SettingsButton>
            </div>
          </RightControls>
        </ControlsSection>

        <ChartGrid>
          <Column>
            <Accordion
              defaultOpen
              title={
                <>
                  <Activity style={{ color: '#dc2626', marginRight: 8, width: '15px', height: '15px' }} />
                  주가 차트 (캔들스틱)
                </>
              }>
              <LightweightCandlestickChart
                data={stockData}
                zoomPercentage={zoomPercentage}
              />
            </Accordion>
            {selectedLineCharts.filter((_, index) => index % 2 === 0).map(renderLineChart)}
          </Column>

          <Column>
            <Accordion
              defaultOpen
              title={
                <>
                  <Activity style={{ color: '#dc2626', marginRight: 8, width: '15px', height: '15px' }} />
                  주가 차트 (캔들스틱)
                </>
              }>
              <LightweightCandlestickChart
                data={stockData}
                zoomPercentage={zoomPercentage}
              />
            </Accordion>
            {selectedLineCharts.filter((_, index) => index % 2 === 1).map(renderLineChart)}
          </Column>

          <Memo
            memo={memo}
            onSave={handleSaveMemo}
          />
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
