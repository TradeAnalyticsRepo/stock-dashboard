"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header.jsx";
import styled from "styled-components";
import { useLastestStockData, useTableStockData } from "./hooks/useStockData.js";
import { processingExcelDataForCummulativePeriod, processingPeriodTableData, stockDataBeforePeriodProcessByCondition } from "../app/utils/excelUtils.js";
import CustomDatePicker from "./ui/CustomDatePicker.jsx";

const PeriodStockTable = ({ stockName, from, to }) => {
  const [tableData, setTableData] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: from,
    to: to
  });
  // const [lastestData, setLastestData] = useState({
  //   개인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   세력합: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   외국인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   금융투자: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   보험: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   투신_일반: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   기타금융: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   은행: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   연기금: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   투신_사모: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   국가매집: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  //   기타법인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
  // });

  useEffect(() => {
    (async () => {
      try {
        console.log(dateRange);
        const { from, to } = dateRange;
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const tableResult = await processingPeriodTableData(stockName, formatDate(from, 'compact'), formatDate(to, 'compact'));
        
        // eslint-disable-next-line react-hooks/rules-of-hooks
        // const lastestResult = await useLastestStockData(stockName);
        
        setTableData(tableResult);
        

        // if (lastestResult?.status === 200) {
        //   setLastestData(lastestResult?.data);
        // }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [dateRange])

  const formatNumber = (num) => {
    return num.toLocaleString(); // 기본은 시스템 locale (한국이면 1,000 식)
  };
  // <Title>투자자별 누적 매집 데이터</Title>
  const formatDate = (date, formatType) =>{
  date = new Date(date);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
  const day = String(date.getDate()).padStart(2, '0');

    if (formatType === 'dash') {
      return `${year}-${month}-${day}`;
    } else if (formatType === 'compact') {
      return `${year}${month}${day}`;
    } else {
      throw new Error('Invalid formatType. Use "dash" or "compact".');
    }
  }

  const wrapperStyle = {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
  };
  const mainStyle = {
    maxWidth: "90rem",
    margin: "0 auto",
    padding: "1.5rem",
  };
  const tableCardStyle = {
    backgroundColor: "#1e1e1e",
    color: "white",
    borderRadius: "1rem",
    padding: "1.5rem",
    marginTop: "2rem",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
    overflowX: "auto",
  };
  const styledTableStyle = {
    width: "100%",
    minWidth: "1200px",
    marginTop:'8px',
    borderCollapse: "collapse",
    fontSize: "0.75rem",
  };
  const theadStyle = {
    backgroundColor: "#2b2b2b",
    color: "#ccc",
  };
  const thStyle = {
    padding: "0.5rem 1px",
    textAlign: "left",
    whiteSpace: "nowrap",
  };
  const tdStyle = {
    padding: "0.5rem 1px",
    borderTop: "1px solid #333",
    whiteSpace: "nowrap",
  };
  
  return (
    <div style={wrapperStyle}>
      <Header
        chartType='table'
        stockName={stockName + '  ( ' + formatDate(dateRange.from, 'dash') + ' ~ ' + formatDate(dateRange.to, 'dash') + ' )'}
      />
      <main style={mainStyle}>
        <section>
          <div style={tableCardStyle}>
            <CustomDatePicker
              onDateRangeChange={(from, to) => setDateRange({ from, to })}
              startDate={new Date(dateRange.from).toISOString().split('T')[0]}
              endDate={new Date(dateRange.to).toISOString().split('T')[0]}
            />
            <table style={styledTableStyle}>
              <thead style={theadStyle}>
                <tr>
                  {[
                    "일자",
                    "평균단가",
                    "거래량",
                    "개인",
                    "세력합",
                    "외국인",
                    "기관종합",
                    "금융투자",
                    "보험",
                    "투신",
                    "기타금융",
                    "은행",
                    "연기금",
                    "사모펀드",
                    "국가",
                    "기타법인",
                  ].map((name, idx) => {
                    return <th style={thStyle} key={idx}>{name}</th>;
                  })}
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, idx) => {
                  const backgroudColor = (() => {
                    if (row.tradeDateNm.endsWith("주")) {
                      return "#1F7D5370";
                    } else if (row.tradeDateNm.endsWith("개월")) {
                      return "#255F3870";
                    } else if (row.tradeDateNm.endsWith("분기")) {
                      return "#27391C70";
                    } else if (row.tradeDateNm.endsWith("년")) {
                      return "#18230F70";
                    }
                  })();

                  const color = (num) => {
                    if (num > 0) return "#ef4444";
                    else if (num < 0) return "#1d74d6";
                  };

                  return (
                    // eslint-disable-next-line react/jsx-key
                    <tr key={idx}>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor }}>
                        {row.tradeDateNm}
                        { row.startDt && <span style={{fontSize: '8px'}}>{`${row.endDt}~${row.startDt}`}</span>}
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor }}>{formatNumber(row.avgMount)}</td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor }}>{formatNumber(row.tradingVolume)}</td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeIndiv) }}>
                        <span>{formatNumber(row.tradingVolumeIndiv)}</span>
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceIndiv)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeTotalForeAndInst) }}>
                        {formatNumber(row.tradingVolumeTotalForeAndInst)}
                        {/* <span style={{color: '#fff'}}>{` (${formatNumber(tradingVolumeTotalIns)})`}</span> */}
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeFore) }}>
                        {formatNumber(row.tradingVolumeFore)}
                      ß  <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceFore)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeTotalIns) }}>
                        {formatNumber(row.tradingVolumeTotalIns)}
                        {/* <span style={{color: '#fff'}}>{` (${formatNumber(tradingVolumeTotalIns)})`}</span> */}
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeFinInv) }}>
                        {formatNumber(row.tradingVolumeFinInv)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceFinInv)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeInsur) }}>
                        {formatNumber(row.tradingVolumeInsur)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceInsur)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeGTrust) }}>
                        {formatNumber(row.tradingVolumeGTrust)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceGTrust)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeEtcFin) }}>
                        {formatNumber(row.tradingVolumeEtcFin)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceEtcFin)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeBank) }}>
                        {formatNumber(row.tradingVolumeBank)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceBank)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumePens) }}>
                        {formatNumber(row.tradingVolumePens)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPricePens)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeSTrust) }}>
                        {formatNumber(row.tradingVolumeSTrust)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceSTrust)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeNat) }}>
                        {formatNumber(row.tradingVolumeNat)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceNat)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeEtc) }}>
                        {formatNumber(row.tradingVolumeEtc)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceEtc)})`}</span>
                      </td>
                    </tr>
                  );
                })}
                {/* <Row>
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
                  <Td style={{ backgroundColor: "#22222270" }}>{"최소보유량"}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{""}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.개인.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.세력합.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.외국인.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.금융투자.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.보험.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_일반.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타금융.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.은행.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.연기금.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.투신_사모.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.국가매집.minColVolume}</Td>
                  <Td style={{ backgroundColor: "#22222270" }}>{lastestData.기타법인.minColVolume}</Td>
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
                </Row> */}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PeriodStockTable;
