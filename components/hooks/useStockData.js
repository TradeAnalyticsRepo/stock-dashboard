import { useState, useEffect, useMemo } from "react";
import { INSTITUTION_KEYS } from "../../types/constants";
import { callGetApi } from "../../app/utils/api.js";

export const useStockData = (allData) => {
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
    to: new Date(),
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const formattedStockData = useMemo(() => {
    return allData
      .filter((item) => item?.주가?.tradeDate)
      .map((item) => ({
        date: item.주가.tradeDate.replace(/\//g, "-"),
        open: item.주가.open,
        high: item.주가.high || item.주가.open,
        low: item.주가.low || item.주가.close,
        close: item.주가.close,
        price: item.주가.close,
        previousDayComparison: item.주가.previousDayComparison,
      }));
  }, [allData]);

  const allInstitutionalData = useMemo(() => {
    const data = {};
    INSTITUTION_KEYS.forEach((key) => {
      if (allData?.[0]?.[key]) {
        data[key] = allData
          .filter((item) => item?.[key]?.tradeDate)
          .map((item) => ({
            date: item[key].tradeDate.replace(/\//g, "-"),
            value: item[key].collectionVolume,
            dispersionRatio: item[key].dispersionRatio,
          }));
      }
    });
    return data;
  }, [allData]);

  const filterDataByDateRange = (data, range) => {
    if (!data || !range.from || !range.to) return [];
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= range.from && itemDate <= range.to;
    });
  };

  const stockData = useMemo(() => filterDataByDateRange(formattedStockData, dateRange), [formattedStockData, dateRange]);

  const institutionalData = useMemo(() => {
    const data = {};
    Object.keys(allInstitutionalData).forEach((key) => {
      data[key] = filterDataByDateRange(allInstitutionalData[key], dateRange);
    });
    return data;
  }, [allInstitutionalData, dateRange]);

  const { open: 전일가, close: 현재가, previousDayComparison: 전일대비 } = stockData.length > 0
    ? stockData[stockData.length - 1]
    : { open: 0, close: 0, previousDayComparison: 0 };

  const currentPrice = 현재가;
  const priceChangePercent = 전일가 !== 0 ? (전일대비 / 전일가) * 100 : 0;

  return {
    isClient,
    stockData,
    institutionalData,
    setDateRange,
  };
};

export const useTableStockData = async (stockName) => {
  return await callGetApi("/api/excel", { stockId: stockName, type: "table" });
};

export const useLastestStockData = async (stockName) => {
  return await callGetApi("/api/excel", { stockId: stockName, type: "lastest" });
};
