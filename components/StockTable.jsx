"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useLastestStockData, useTableStockData } from "./hooks/useStockData.js";

const StockTable = ({ stockName }) => {
  const [tableData, setTableData] = useState([]);
  const [lastestData, setLastestData] = useState({
    개인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    세력합: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    외국인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    금융투자: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    보험: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    투신: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    기타금융: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    은행: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    연기금: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    사모펀드: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    국가매집: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
    기타법인: { collectionVolume: 0, stockCorrelation: 0, maxColVolume: 0, minColVolume: 0, dispersionRatio: 0, stockMomentum: 0 },
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

  const formatNumber = (num) => {
    if(!num) return 0;
    return num.toLocaleString(); // 기본은 시스템 locale (한국이면 1,000 식)
  };

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
        stockName={stockName}
      />
      <main style={mainStyle}>
        <section>
          <div style={tableCardStyle}>
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
                    return <th key={idx} style={thStyle}>{name}</th>;
                  })}
                </tr>
              </thead>

              <tbody>
                {tableData.map((row, idx) => {
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
                        {formatNumber(row.tradingVolumeIndiv)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceIndiv)})`}</span>
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeTotalForeAndInst) }}>
                        {formatNumber(row.tradingVolumeTotalForeAndInst)}
                      </td>
                      <td style={{ ...tdStyle, backgroundColor: backgroudColor, color: color(row.tradingVolumeFore) }}>
                        {formatNumber(row.tradingVolumeFore)}
                        <span style={{color: '#fff'}}>{` (${formatNumber(row.avgPriceFore)})`}</span>
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
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{"현재보유량"}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.개인.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.세력합.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.외국인.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.금융투자.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.보험.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.투신.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타금융.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.은행.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.연기금.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.사모펀드.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.국가매집.collectionVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타법인.collectionVolume)}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{"상관계수"}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.개인.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.세력합.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.외국인.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.금융투자.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.보험.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.투신.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.기타금융.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.은행.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.연기금.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.사모펀드.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.국가매집.stockCorrelation}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.기타법인.stockCorrelation}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{"최대보유량"}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.개인.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.세력합.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.외국인.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.금융투자.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.보험.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.투신.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타금융.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.은행.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.연기금.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.사모펀드.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.국가매집.maxColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타법인.maxColVolume)}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{"최소보유량"}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.개인.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.세력합.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.외국인.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.금융투자.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.보험.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.투신.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타금융.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.은행.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.연기금.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.사모펀드.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.국가매집.minColVolume)}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{formatNumber(lastestData.기타법인.minColVolume)}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{"분산비율"}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.개인.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.세력합.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.외국인.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.금융투자.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.보험.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.투신.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.기타금융.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.은행.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.연기금.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.사모펀드.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.국가매집.dispersionRatio + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.기타법인.dispersionRatio + "%"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{"주가선도"}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#22222270" }}>{""}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.개인.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.세력합.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.외국인.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.금융투자.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.보험.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.투신.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.기타금융.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.은행.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.연기금.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.사모펀드.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.국가매집.stockMomentum + "%"}</td>
                  <td style={{ ...tdStyle, textAlign:'center', backgroundColor: "#22222270" }}>{lastestData.기타법인.stockMomentum + "%"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default StockTable;