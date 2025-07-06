import React, { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react";
import { StockDataItem } from "@/types";
import CustomDatePicker from "./CustomDatePicker";

interface Props {
  data: StockDataItem[];
  period: string;
}

/**
 * 기간별 평균 단가를 표시하는 카드 컴포넌트
 * - 선택된 기간의 평균 단가 계산
 * - 전체 기간 대비 변화율 표시
 * - 커스텀 날짜 범위 선택 가능
 * - 예쁜 디자인과 애니메이션 효과
 * @param {Props} props - data, period
 * @returns {JSX.Element}
 */
const AveragePriceCard: React.FC<Props> = ({ data, period }) => {
  const [customDateRange, setCustomDateRange] = useState<{ startDate: Date; endDate: Date } | null>(null);
  const [useCustomRange, setUseCustomRange] = useState(false);

  if (!data || data.length === 0) {
    return (
      <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl backdrop-blur-sm'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-gray-600/20 rounded-lg'>
            <DollarSign className='w-5 h-5 text-gray-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-gray-400'>평균 단가</h3>
            <p className='text-sm text-gray-500'>데이터가 없습니다</p>
          </div>
        </div>
      </div>
    );
  }

  // 계산할 데이터 결정
  let calculationData = data;
  let calculationPeriod = period;

  if (useCustomRange && customDateRange) {
    // 커스텀 날짜 범위에 해당하는 데이터 필터링
    calculationData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= customDateRange.startDate && itemDate <= customDateRange.endDate;
    });
    calculationPeriod = "custom";

    // 커스텀 범위에 데이터가 없으면 기본 데이터 사용
    if (calculationData.length === 0) {
      calculationData = data;
      calculationPeriod = period;
    }
  }

  // 평균 단가 계산 (NaN 방지)
  const averagePrice =
    calculationData.length > 0 ? Math.round(calculationData.reduce((sum, item) => sum + item.close, 0) / calculationData.length) : 0;

  // 전체 기간 평균 단가 (비교용, NaN 방지)
  const allTimeAverage = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.close, 0) / data.length) : 0;

  // 변화율 계산 (NaN 방지)
  const changePercent = allTimeAverage > 0 ? ((averagePrice - allTimeAverage) / allTimeAverage) * 100 : 0;
  const isPositive = changePercent >= 0;

  // 기간별 라벨
  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "6M":
        return "6개월";
      case "1Y":
        return "1년";
      case "2Y":
        return "2년";
      case "5Y":
        return "5년";
      case "custom":
        return "선택 기간";
      default:
        return period;
    }
  };

  // 데이터 포인트 수
  const dataPoints = calculationData.length;

  // 커스텀 날짜 범위 변경 핸들러
  const handleCustomDateRangeChange = (startDate: Date, endDate: Date) => {
    setCustomDateRange({ startDate, endDate });
    setUseCustomRange(true);
  };

  // 커스텀 범위 초기화
  const handleResetCustomRange = () => {
    setCustomDateRange(null);
    setUseCustomRange(false);
  };

  return (
    <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-600/20 rounded-lg'>
            <DollarSign className='w-5 h-5 text-blue-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white'>{getPeriodLabel(calculationPeriod)} 평균 단가</h3>
            <p className='text-sm text-gray-400'>{dataPoints}개 거래일 기준</p>
          </div>
        </div>

        {/* 변화율 표시 */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
            isPositive ? "bg-green-600/20 text-green-400 border border-green-600/30" : "bg-red-600/20 text-red-400 border border-red-600/30"
          }`}>
          {isPositive ? <TrendingUp className='w-4 h-4' /> : <TrendingDown className='w-4 h-4' />}
          {Math.abs(changePercent).toFixed(1)}%
        </div>
      </div>

      {/* 평균 단가 표시 */}
      <div className='mb-4'>
        <div className='text-3xl font-bold text-white mb-1'>₩{averagePrice.toLocaleString()}</div>
        <div className='text-sm text-gray-400'>전체 기간 평균: ₩{allTimeAverage.toLocaleString()}</div>
      </div>

      {/* 커스텀 날짜 선택 섹션 */}
      <div className='mb-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600'>
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            <Calendar className='w-4 h-4 text-gray-400' />
            <span className='text-sm font-medium text-gray-300'>커스텀 기간 선택</span>
          </div>
          {useCustomRange && (
            <button
              onClick={handleResetCustomRange}
              className='px-3 py-1.5 text-xs font-medium text-gray-800 bg-amber-400 hover:bg-amber-300 border border-amber-500 rounded-lg transition-all duration-200 hover:shadow-md hover:scale-105 active:scale-95'>
              기본 기간으로
            </button>
          )}
        </div>

        <div className='flex items-center gap-3'>
          <CustomDatePicker
            onDateRangeChange={handleCustomDateRangeChange}
            className='flex-1'
          />

          {useCustomRange && customDateRange && (
            <div className='text-xs text-gray-400'>
              {customDateRange.startDate.toLocaleDateString("ko-KR")} ~ {customDateRange.endDate.toLocaleDateString("ko-KR")}
            </div>
          )}
        </div>
      </div>

      {/* 추가 정보 */}
      <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-700'>
        <div>
          <div className='text-sm text-gray-400 mb-1'>최고가</div>
          <div className='text-lg font-semibold text-green-400'>
            ₩{calculationData.length > 0 ? Math.max(...calculationData.map((item) => item.high)).toLocaleString() : "0"}
          </div>
        </div>
        <div>
          <div className='text-sm text-gray-400 mb-1'>최저가</div>
          <div className='text-lg font-semibold text-red-400'>
            ₩{calculationData.length > 0 ? Math.min(...calculationData.map((item) => item.low)).toLocaleString() : "0"}
          </div>
        </div>
      </div>

      {/* 시각적 인디케이터 */}
      <div className='mt-4 flex items-center gap-2'>
        <div className='flex-1 h-2 bg-gray-700 rounded-full overflow-hidden'>
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isPositive ? "bg-gradient-to-r from-green-500 to-green-400" : "bg-gradient-to-r from-red-500 to-red-400"
            }`}
            style={{
              width: `${Math.min(Math.abs(changePercent) * 2, 100)}%`,
            }}
          />
        </div>
        <div className='text-xs text-gray-500 min-w-[60px] text-right'>{isPositive ? "상승" : "하락"}</div>
      </div>
    </div>
  );
};

export default AveragePriceCard;
