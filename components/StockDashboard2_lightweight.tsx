"use client";

import React, { useEffect, useState } from "react";
import { Activity, Users, Globe, Building } from "lucide-react";
import Header from "@/components/Header";
import StatCard from "@/components/ui/StatCard";
import PeriodButton from "@/components/ui/PeriodButton";
import AveragePriceCard from "@/components/ui/AveragePriceCard";
import LightweightCandlestickChart from "@/components/charts/lightweight/LightweightCandlestickChart";
import LightweightLineChart from "@/components/charts/lightweight/LightweightLineChart";
import { useLastestStockData, useStockData } from "@/components/hooks/useStockData";
import { LINE_CHART_COLORS, PERIODS } from "@/types/constants";
import styled from "styled-components";
import Accordion from "@/components/ui/Accordion";
import { ChartData } from "@/types/processingData";
import Modal from "./ui/Modal";

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
  shouldForwardProp: (prop) => prop !== "grid" && prop !== "flex", // grid, flex는 스타일 계산에만 사용, DOM에는 전달하지 않음
})<{ grid?: boolean; flex?: boolean }>`
  ${(props) =>
    props.grid
      ? `
        @media (min-width: 1024px) {
          column-count: 2;
          column-gap: 1rem;
        }
        & > * {
          break-inside: avoid;
          margin-bottom: 1rem;
        }
      `
      : props.flex
      ? `display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;`
      : ""}
`;

const ChartGrid = styled.div`
  @media (min-width: 1024px) {
    display: flex;
    gap: 1rem;
    align-items: flex-start;
  }
`;

const Column = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const FullWidthWrapper = styled.div`
  margin-bottom: 1rem;
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

const FlexCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CloseButton = styled.button`
  margin-top: 20px;
  margin-left: calc(100% - 61px);
  padding: 8px 16px;
  background-color: #ddd;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const SubTitle = styled.div`
  margin-left : auto;
  font-size: 13px;
  display:flex;
   
  > div + div{
   margin-left: .5rem;
  }
`;

/**
 * Main component to display the stock dashboard using Lightweight-charts.
 * Manages data through the useStockData hook.
 * Includes key metrics, period selection buttons, and a chart grid.
 */
const StockDashboardLightweight = ({ stockName, allData, lastestData }: { stockName?: string | null; allData: object[]; lastestData: ChartData }) => {
  const { isClient, stockData, institutionalData, selectedPeriod, setSelectedPeriod } = useStockData("10Y", allData);
  const [showAveragePrice, setShowAveragePrice] = useState(false);

  useEffect(() => {
    console.log({
      isClient,
      stockData,
      institutionalData,
      lastestData
    });
  }, []);

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
        <Section flex>
          {PERIODS.map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
          <ToggleButton onClick={() => setShowAveragePrice((prev) => !prev)}>{showAveragePrice ? "평균값 숨기기" : "평균값 보기"}</ToggleButton>
        </Section>
        <FullWidthWrapper>
          <Accordion
            defaultOpen
            title={
              <>
                <Activity style={{ color: "#dc2626", marginRight: 8 }} />
                주가 차트 (캔들스틱)
              </>
            }>
            <LightweightCandlestickChart data={stockData} />
          </Accordion>
        </FullWidthWrapper>
        {/* {showAveragePrice && (
          <FullWidthWrapper>
            <Accordion
              defaultOpen
              title={
                <>
                  <Users style={{ color: "#f59e0b", marginRight: 8 }} />
                  주요기간 평균값
                </>
              }>
              <AveragePriceCard
                data={stockData}
                period={selectedPeriod}
              />
            </Accordion>
          </FullWidthWrapper>
        )} */}
        <ChartGrid>
          <Column>
            {Object.keys(institutionalData)
              .filter((_, index) => index % 2 === 0)
              .map((key) => (
                <Accordion
                  key={key}
                  defaultOpen
                  title={
                    <>
                      <Users style={{ color: LINE_CHART_COLORS[key], marginRight: 8 }} />
                      {key} 매집수량
                      <SubTitle>
                        <div>매집수량 : {lastestData[key].collectionVolume.toLocaleString()}</div>
                        <div>분산비율 : {lastestData[key].dispersionRatio}%</div>
                      </SubTitle>
                    </>
                  }>
                  <LightweightLineChart
                    chartName={key}
                    data={institutionalData[key]}
                    color={LINE_CHART_COLORS[key] || "#ffffff"}
                    yFormatter={(v) => Math.round(v).toLocaleString()}
                  />
                </Accordion>
              ))}
          </Column>
          <Column>
            {Object.keys(institutionalData)
              .filter((_, index) => index % 2 === 1)
              .map((key) => (
                <Accordion
                  key={key}
                  defaultOpen
                  title={
                    <>
                      <Users style={{ color: LINE_CHART_COLORS[key], marginRight: 8 }} />
                      {key} 매집수량
                      <SubTitle>
                        <div>매집수량 : {lastestData[key].collectionVolume.toLocaleString()}</div>
                        <div>분산비율 : {lastestData[key].dispersionRatio}%</div>
                      </SubTitle>
                    </>
                  }>
                  <LightweightLineChart
                    chartName={key}
                    data={institutionalData[key]}
                    color={LINE_CHART_COLORS[key] || "#ffffff"}
                    yFormatter={(v) => Math.round(v).toLocaleString()}
                  />
                </Accordion>
              ))}
          </Column>
        </ChartGrid>
      </Main>
       <Modal isOpen={showAveragePrice} onClose={() => setShowAveragePrice(false)}>
        <h2>모달 제목</h2>
        <AveragePriceCard
          data={stockData}
          period={selectedPeriod}
        />
        <CloseButton onClick={() => setShowAveragePrice(false)}>닫기</CloseButton>
      </Modal>
    </Wrapper>
  );
};

export default StockDashboardLightweight;

// const Card = styled.div`
//   background: #1a1a1a;
//   border-radius: 0.5rem;
//   padding: 1.5rem;
//   border: 1px solid #27272a;
// `;
// const ChartTitle = styled.h3`
//   font-size: 1.25rem;
//   font-weight: 600;
//   margin: 0;
//   display: flex;
//   align-items: center;
// `;
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
