"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import styled from "styled-components";
import { useLastestStockData, useTableStockData } from "./hooks/useStockData";
import { TableData } from "@/types/processingData";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;
const Main = styled.main`
  max-width: 90rem;
  margin: 0 auto;
  padding: 1.5rem;
`;

// Section: grid, flex prop이 DOM에 전달되지 않도록 withConfig 사용
const Section = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== "grid" && prop !== "flex", // grid, flex는 스타일 계산에만 사용, DOM에는 전달하지 않음
})<{ grid?: boolean; flex?: boolean }>`
  ${(props) =>
    props.grid
      ? `display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;
        @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
        @media (min-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      `
      : props.flex
      ? `display: flex; gap: 0.5rem; margin-bottom: 1.5rem;`
      : ""}
`;
const FlexCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TableCard = styled.div`
  background-color: #1e1e1e;
  color: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-top: 2rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  overflow-x: auto;
`;

const Title = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
`;

const StyledTable = styled.table`
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
  font-size: 0.75rem;
`;

const Thead = styled.thead`
  background-color: #2b2b2b;
  color: #ccc;
`;

const Th = styled.th`
  padding: 0.5rem 1rem;
  text-align: left;
  white-space: nowrap;
`;

const Td = styled.td`
  padding: 0.5rem 1rem;
  border-top: 1px solid #333;
  white-space: nowrap;
`;

const Row = styled.tr`
  &:hover {
    background-color: #2a2a2a;
  }
`;

const StockTable = ({ stockName }: { stockName?: string | null }) => {
  const [tableData, setTableData] = useState([]);
  const [lastestData, setLastestData] = useState({
    개인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    세력합: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    외국인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    금융투자: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    보험: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    투신_일반: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    기타금융: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    은행: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    연기금: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    투신_사모: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    국가매집: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    기타법인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  });
  useEffect(() => {
    (async () => {
      try {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const tableResult = await useTableStockData(stockName);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const lastestResult = await useLastestStockData(stockName);
        if (tableResult?.status === 200) {
          setTableData(tableResult.data);
        }

        if (lastestResult?.status === 200) {
          setLastestData(lastestResult?.data);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [stockName]);

  const formatNumber = (num: number): string => {
    return num.toLocaleString(); // 기본은 시스템 locale (한국이면 1,000 식)
  };
  // <Title>투자자별 누적 매집 데이터</Title>

  return (
    <Wrapper>
      <Header
        chartType='table'
        stockName={stockName}
      />
      <Main>
        <Section>
          <TableCard>
            <StyledTable>
              <Thead>
                <tr>
                  <Th>일자</Th>
                  <Th>평균단가</Th>
                  <Th>거래량</Th>
                  <Th>개인</Th>
                  <Th>세력합</Th>
                  <Th>외국인</Th>
                  <Th>금융투자</Th>
                  <Th>보험</Th>
                  <Th>투신</Th>
                  <Th>기타금융</Th>
                  <Th>은행</Th>
                  <Th>연기금</Th>
                  <Th>사모펀드</Th>
                  <Th>국가</Th>
                  <Th>기타법인</Th>
                </tr>
              </Thead>
              <tbody>
                {tableData.map((row: TableData, idx) => {
                  const backgroudColor = (() => {
                    if (row.tradeDateNm.endsWith("주")) {
                      return "#1F7D5370";
                    } else if (row.tradeDateNm.endsWith("월")) {
                      return "#255F3870";
                    } else if (row.tradeDateNm.endsWith("분기")) {
                      return "#27391C70";
                    } else if (row.tradeDateNm.endsWith("년")) {
                      return "#18230F70";
                    }
                  })();

                  const color = (num: number) => {
                    if (num > 0) return "#ef4444";
                    else if (num < 0) return "#1d74d6";
                  };

                  return (
                    // eslint-disable-next-line react/jsx-key
                    <Row key={idx}>
                      <Td style={{ backgroundColor: backgroudColor }}>{row.tradeDateNm}</Td>
                      <Td style={{ backgroundColor: backgroudColor }}>{formatNumber(row.avgMount)}</Td>
                      <Td style={{ backgroundColor: backgroudColor }}>{formatNumber(row.tradingVolume)}</Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeIndiv) }}>
                        {formatNumber(row.tradingVolumeIndiv)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeTotalIns) }}>
                        {formatNumber(row.tradingVolumeTotalIns)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeFore) }}>{formatNumber(row.tradingVolumeFore)}</Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeFinInv) }}>
                        {formatNumber(row.tradingVolumeFinInv)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeInsur) }}>
                        {formatNumber(row.tradingVolumeInsur)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeGTrust) }}>
                        {formatNumber(row.tradingVolumeGTrust)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeEtcFin) }}>
                        {formatNumber(row.tradingVolumeEtcFin)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeBank) }}>{formatNumber(row.tradingVolumeBank)}</Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumePens) }}>{formatNumber(row.tradingVolumePens)}</Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeSTrust) }}>
                        {formatNumber(row.tradingVolumeSTrust)}
                      </Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeNat) }}>{formatNumber(row.tradingVolumeNat)}</Td>
                      <Td style={{ backgroundColor: backgroudColor, color: color(row.tradingVolumeEtc) }}>{formatNumber(row.tradingVolumeEtc)}</Td>
                    </Row>
                  );
                })}
                <Row>
                  <Td style={{ backgroundColor: "#22222270" }}>{"현재보유량"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.개인.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.세력합.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.외국인.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.금융투자.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.보험.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.투신_일반.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타금융.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.은행.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.연기금.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.투신_사모.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.국가매집.collectionVolume)}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타법인.collectionVolume)}</Td>
                </Row>
                <Row>
                  <Td style={{ backgroundColor: "#22222270" }}>{"상관계수"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.개인.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.세력합.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.외국인.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.금융투자.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.보험.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_일반.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타금융.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.은행.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.연기금.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_사모.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.국가매집.stockCorrelation}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타법인.stockCorrelation}</Td>
                </Row>
                <Row>
                  <Td style={{ backgroundColor: "#22222270" }}>{"최대보유량"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.개인.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.세력합.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.외국인.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.금융투자.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.보험.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_일반.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타금융.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.은행.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.연기금.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_사모.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.국가매집.maxColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타법인.maxColVolume}</Td>
                </Row>
                <Row>
                  <Td style={{ backgroundColor: "#22222270" }}>{"분산비율"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.개인.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.세력합.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.외국인.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.금융투자.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.보험.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_일반.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타금융.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.은행.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.연기금.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_사모.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.국가매집.dispersionRatio + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타법인.dispersionRatio + "%"}</Td>
                </Row>
                <Row>
                  <Td style={{ backgroundColor: "#22222270" }}>{"주가선도"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.개인.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.세력합.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.외국인.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.금융투자.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.보험.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_일반.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타금융.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.은행.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.연기금.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_사모.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.국가매집.stockMomentum + "%"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타법인.stockMomentum + "%"}</Td>
                </Row>
              </tbody>
            </StyledTable>
          </TableCard>
        </Section>
      </Main>
    </Wrapper>
  );
};

export default StockTable;
