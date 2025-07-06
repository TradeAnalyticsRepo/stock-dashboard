"use client";

import React, { useRef } from "react";
import { Activity, Users, Globe, Building } from "lucide-react";
import Header from "@/components/Header";
import StatCard from "@/components/ui/StatCard";
import PeriodButton from "@/components/ui/PeriodButton";
import AveragePriceCard from "@/components/ui/AveragePriceCard";
import RechartsPriceChart from "@/components/charts/recharts/RechartsPriceChart";
import RechartsShareholderChart from "@/components/charts/recharts/RechartsShareholderChart";
import { useStockData } from "@/components/hooks/useStockData";
import { LINE_CHART_COLORS, PERIODS } from "@/types/constants";
import { processingExcelData } from "@/app/utils/excelUtils";

/**
 * Recharts를 사용하여 주식 대시보드를 표시하는 메인 컴포넌트
 * - useStockData 훅을 통해 데이터를 관리
 * - 주요 지표, 기간 선택 버튼, 차트 그리드를 포함
 */
const StockDashboard = () => {
  const { isClient, stockData, institutionalData, selectedPeriod, setSelectedPeriod, priceChangePercent, currentPrice } = useStockData("1Y");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 클라이언트 사이드에서만 렌더링되도록 처리
  if (!isClient) {
    return <div className='min-h-screen bg-black text-white flex items-center justify-center'>로딩 중...</div>;
  }

  // 최신 값 가져오기
  const getLatestValue = (data: { value: number }[]) => {
    if (data && data.length > 0) {
      return data[data.length - 1].value;
    }
    return 0;
  };

  const latestIndividualVolume = getLatestValue(institutionalData.개인);
  const latestForeignerVolume = getLatestValue(institutionalData.외국인);
  const latestCombinedForcesVolume = getLatestValue(institutionalData.세력합);

  /**
   * 엑셀 파일 업로드 처리 함수
   * @param e - 파일 input change 이벤트
   */
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      //   handleExcel(file);
      const data = await processingExcelData(file);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <Header chartType='rechart' />

      <main className='max-w-7xl mx-auto p-6'>
        {/* 주요 지표 섹션 */}
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

        {/* 기간 선택 버튼 섹션 */}
        <section className='flex space-x-2 mb-6'>
          {PERIODS.map((period) => (
            <PeriodButton
              key={period}
              period={period}
              active={selectedPeriod === period}
              onClick={setSelectedPeriod}
            />
          ))}
          <div style={{marginLeft: 'auto'}}onClick={() => {fileInputRef.current?.click();}} >
            엑셀업로드
            <input
              type='file'
              accept='.xlsx, .xls'
              ref={fileInputRef}
              style={{
                display: "none",
              }}
              onChange={handleExcelUpload}
            />
          </div>
        </section>

        {/* 차트 그리드 섹션 */}
        <section className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-gray-900 rounded-lg p-6 border border-gray-800 lg:col-span-2'>
            <h3 className='text-xl font-semibold mb-4 flex items-center'>
              <Activity className='text-red-600 mr-2' />
              주가 차트 (캔들스틱)
            </h3>
            <RechartsPriceChart data={stockData} />
          </div>

          {/* 평균 단가 카드 */}
          <div className='lg:col-span-2'>
            <AveragePriceCard
              data={stockData}
              period={selectedPeriod}
            />
          </div>

          {Object.keys(institutionalData).map((key) => (
            <div
              key={key}
              className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
              <h3 className='text-xl font-semibold mb-4 flex items-center'>
                <Users
                  style={{ color: LINE_CHART_COLORS[key] }}
                  className='mr-2'
                />
                {key} 매집수량
              </h3>
              <RechartsShareholderChart
                data={institutionalData[key]}
                color={LINE_CHART_COLORS[key] || "#ffffff"}
                title={key}
              />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default StockDashboard;
