import { useState, useEffect } from "react";
import { StockDataItem, ShareholderDataItem } from "@/types";
import { dummyStockData } from "@/components/data";
import { excelData } from "@/components/excelData";

/**
 * 데이터 필터링 및 가공을 처리하는 커스텀 훅
 * @param initialPeriod - 초기 선택된 기간 (기본값: "1Y")
 * @returns { stockData, individualData, foreignData, institutionalData, selectedPeriod, setSelectedPeriod, priceChangePercent, currentPrice }
 */
export const useStockData = (initialPeriod: string = "1Y") => {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  // 클라이언트 사이드 렌더링을 위한 상태
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  /**
   * 주어진 기간에 따라 데이터를 필터링하는 함수
   * @param data - 필터링할 데이터 배열
   * @param period - 필터링할 기간 ("6M", "1Y", "2Y", "5Y")
   * @returns 필터링된 데이터 배열
   */
  const filterDataByPeriod = (data: (StockDataItem | ShareholderDataItem)[], period: string) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    switch (period) {
      case "6M":
        return data.filter((item) => {
          const [year, month] = item.date.split("-").map(Number);
          const itemDate = new Date(year, month - 1);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return itemDate >= sixMonthsAgo;
        });
      case "1Y":
        return data.filter((item) => {
          const [year] = item.date.split("-").map(Number);
          return year >= currentYear - 1;
        });
      case "2Y":
        return data.filter((item) => {
          const [year] = item.date.split("-").map(Number);
          return year >= currentYear - 2;
        });
      case "5Y":
      default:
        return data;
    }
  };

  // excelData를 StockDataItem 형식으로 변환
  // 임시 데이터: 실제 고가, 저가, 시가 데이터가 없어서 종가를 기준으로 임의 생성
  const formattedStockData: StockDataItem[] = excelData.map((v, index) => {
    const closePrice = v.endMount;

    // 임시 데이터 생성 로직
    // 시가: 전일 종가 대비 -2% ~ +2% 범위에서 랜덤 생성
    const openVariation = (Math.random() - 0.5) * 0.04; // -2% ~ +2%
    const openPrice = Math.round(closePrice * (1 + openVariation));

    // 고가: 시가와 종가 중 높은 값보다 0.5% ~ 3% 높게 설정
    const higherPrice = Math.max(openPrice, closePrice);
    const highVariation = 0.005 + Math.random() * 0.025; // 0.5% ~ 3%
    const highPrice = Math.round(higherPrice * (1 + highVariation));

    // 저가: 시가와 종가 중 낮은 값보다 0.5% ~ 3% 낮게 설정
    const lowerPrice = Math.min(openPrice, closePrice);
    const lowVariation = 0.005 + Math.random() * 0.025; // 0.5% ~ 3%
    const lowPrice = Math.round(lowerPrice * (1 - lowVariation));

    // 가격 순서 검증 및 조정 (고가 >= 시가, 종가, 저가 / 저가 <= 시가, 종가, 고가)
    const finalHigh = Math.max(highPrice, openPrice, closePrice);
    const finalLow = Math.min(lowPrice, openPrice, closePrice);

    return {
      date: v.tradeDate.replace(/\//g, "-"),
      price: closePrice, // 기존 호환성을 위한 price 필드
      open: openPrice,
      high: finalHigh,
      low: finalLow,
      close: closePrice,
    };
  });
  // 기간에 따라 데이터 필터링
  const stockData = filterDataByPeriod(formattedStockData, selectedPeriod) as StockDataItem[];
  const individualData = filterDataByPeriod(dummyStockData.개인, selectedPeriod) as ShareholderDataItem[];
  const foreignData = filterDataByPeriod(dummyStockData.외국인, selectedPeriod) as ShareholderDataItem[];
  const institutionalData = filterDataByPeriod(dummyStockData.기관, selectedPeriod) as ShareholderDataItem[];

  // 현재가 및 등락률 계산
  const currentPrice = stockData.length > 0 ? stockData[stockData.length - 1].close : 0;
  const previousPrice = stockData.length > 1 ? stockData[stockData.length - 2].close : 0;
  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = previousPrice !== 0 ? (priceChange / previousPrice) * 100 : 0;

  return {
    isClient,
    stockData,
    individualData,
    foreignData,
    institutionalData,
    selectedPeriod,
    setSelectedPeriod,
    priceChangePercent,
    currentPrice,
  };
};
