"use client";

import React from "react";
import { Activity, Users, Globe, Building } from "lucide-react";
import Header from "@/components/Header";
import StatCard from "@/components/ui/StatCard";
import PeriodButton from "@/components/ui/PeriodButton";
import LightweightCandlestickChart from "@/components/charts/lightweight/LightweightCandlestickChart";
import LightweightLineChart from "@/components/charts/lightweight/LightweightLineChart";
import { useStockData } from "@/components/hooks/useStockData";

/**
 * Main component to display the stock dashboard using Lightweight-charts.
 * Manages data through the useStockData hook.
 * Includes key metrics, period selection buttons, and a chart grid.
 */
const StockDashboardLightweight = () => {
  const {
    isClient,
    stockData,
    institutionalData,
    selectedPeriod,
    setSelectedPeriod,
    priceChangePercent,
    currentPrice,
  } = useStockData("1Y");

  if (!isClient) {
    return <div className='min-h-screen bg-black text-white flex items-center justify-center'>로딩 중...</div>;
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

  const lineChartColors: { [key: string]: string } = {
    개인: "#3b82f6",
    외국인: "#10b981",
    세력합: "#8b5cf6",
    투신_일반: "#f97316",
    투신_사모: "#ec4899",
    은행: "#f59e0b",
    보험: "#6366f1",
    기타금융: "#d946ef",
    연기금: "#06b6d4",
    국가매집: "#ef4444",
    기타법인: "#a855f7",
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <Header chartType='lightweight' />

      <main className='max-w-7xl mx-auto p-6'>
        <section className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
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
        </section>

        <section className='flex space-x-2 mb-6'>
          {["6M", "1Y", "2Y", "5Y"].map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
        </section>

        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800 lg:col-span-2'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Activity className='text-red-600 mr-2' />
              주가 차트 (캔들스틱)
            </h3>
            <LightweightCandlestickChart data={stockData} />
          </div>

          {Object.keys(institutionalData).map((key) => (
            <div key={key} className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
              <h3 className='text-xl font-semibold mb-4 flex items-center'>
                <Users style={{ color: lineChartColors[key] }} className='mr-2' />
                {key} 매집수량
              </h3>
              <LightweightLineChart
                data={institutionalData[key]}
                color={lineChartColors[key] || "#ffffff"}
                yFormatter={(v) => v.toLocaleString()}
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default StockDashboardLightweight;