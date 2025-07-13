import { useState, useEffect } from 'react';
import { StockDataItem } from '@/types';
import jsonData from '@/excel/11111_graph.json';
import { INSTITUTION_KEYS } from '@/types/constants';
import { callGetApi } from '@/app/utils/api';

// 보유율 데이터 타입 정의
export interface ShareholderData {
  date: string;
  value: number;
}

// 기관별 데이터 타입을 위한 인터페이스
export interface InstitutionalData {
  [key: string]: ShareholderData[];
}

/**
 * 주식 데이터 처리를 위한 커스텀 훅
 * @param initialPeriod - 초기 선택 기간 (기본값: "1Y")
 * @returns 차트 및 표시에 필요한 처리된 데이터
 */
export const useStockData = (initialPeriod: string = '1Y') => {
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const allData: any[] = jsonData;

  // // 주가 데이터 포맷팅
  // const formattedStockData: StockDataItem[] = allData.map((item) => ({
  //   date: item.주가.tradeDate.replace(/\//g, "-"),
  //   high: item.주가.high || item.주가.open,
  //   low: item.주가.low || item.주가.open,
  //   ...item.주가,
  // }));

  // 주가 데이터 포맷팅
  const formattedStockData: StockDataItem[] = allData.map((item) => ({
    date: item.주가.tradeDate.replace(/\//g, '-'),
    open: item.주가.open,
    // high: item.주가.high || item.주가.open,
    high: item.주가.high || item.주가.open,
    low: item.주가.low || item.주가.close,
    close: item.주가.close,
    price: item.주가.close,
    previousDayComparison: item.주가.previousDayComparison,
  }));

  // 기관별 데이터 포맷팅
  const allInstitutionalData: InstitutionalData = {};
  INSTITUTION_KEYS.forEach((key) => {
    if (allData[0][key]) {
      allInstitutionalData[key] = allData.map((item) => ({
        date: item[key].tradeDate.replace(/\//g, '-'),
        value: item[key].collectionVolume,
      }));
    }
  });

  // 기간에 따라 데이터 필터링
  const filterDataByPeriod = (data: any[] | undefined, period: string) => {
    if (!data) {
      return [];
    }
    const now = new Date();
    let startDate = new Date();

    switch (period) {
      case '6M':
        startDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      case '2Y':
        startDate.setFullYear(now.getFullYear() - 2);
        break;
      case '5Y':
        startDate.setFullYear(now.getFullYear() - 5);
        break;
      default:
        return data;
    }
    return data.filter((item) => new Date(item.date) >= startDate);
  };

  // 기간에 따라 필터링된 데이터
  const stockData = filterDataByPeriod(formattedStockData, selectedPeriod);

  // 기관별 데이터를 기간에 따라 필터링
  const institutionalData: InstitutionalData = {};
  Object.keys(allInstitutionalData).forEach((key) => {
    institutionalData[key] = filterDataByPeriod(allInstitutionalData[key], selectedPeriod);
  });

  // 현재가 및 등락률 계산
  const {
    open: 전일가,
    close: 현재가,
    previousDayComparison: 전일대비,
  }: StockDataItem = stockData.length > 0
    ? stockData[stockData.length - 1]
    : {
        open: 0,
        close: 0,
        previousDayComparison: 0,
      };

  const currentPrice = 현재가;
  const priceChangePercent = 전일가 !== 0 ? (전일대비 / 전일가) * 100 : 0;

  return {
    isClient,
    stockData,
    institutionalData,
    selectedPeriod,
    setSelectedPeriod,
    priceChangePercent,
    currentPrice,
  };
};

export const useTableStockData = async (stockName?: string) => {
  return await callGetApi('/api/excel', {stockId: stockName, type: 'table'});
}

export const useLastestStockData = async (stockName?: string) => {
  return await callGetApi('/api/excel', {stockId: stockName, type: 'lastest'});
}