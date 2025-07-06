import React from "react";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";
import { StockDataItem } from "@/types";

interface Props {
  data: StockDataItem[];
  period: string;
}

/**
 * 기간별 평균 단가를 표시하는 카드 컴포넌트
 * - 선택된 기간의 평균 단가 계산
 * - 전체 기간 대비 변화율 표시
 * - 예쁜 디자인과 애니메이션 효과
 * @param {Props} props - data, period
 * @returns {JSX.Element}
 */
const AveragePriceCard: React.FC<Props> = ({ data, period }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // 평균 단가 계산
  const averagePrice = Math.round(data.reduce((sum, item) => sum + item.close, 0) / data.length);

  // 전체 기간 평균 단가 (비교용)
  const allTimeAverage = Math.round(data.reduce((sum, item) => sum + item.close, 0) / data.length);

  // 변화율 계산
  const changePercent = ((averagePrice - allTimeAverage) / allTimeAverage) * 100;
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
      default:
        return period;
    }
  };

  // 데이터 포인트 수
  const dataPoints = data.length;

  return (
    <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 shadow-xl backdrop-blur-sm'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-blue-600/20 rounded-lg'>
            <DollarSign className='w-5 h-5 text-blue-400' />
          </div>
          <div>
            <h3 className='text-lg font-semibold text-white'>{getPeriodLabel(period)} 평균 단가</h3>
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

      {/* 추가 정보 */}
      <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-700'>
        <div>
          <div className='text-sm text-gray-400 mb-1'>최고가</div>
          <div className='text-lg font-semibold text-green-400'>₩{Math.max(...data.map((item) => item.high)).toLocaleString()}</div>
        </div>
        <div>
          <div className='text-sm text-gray-400 mb-1'>최저가</div>
          <div className='text-lg font-semibold text-red-400'>₩{Math.min(...data.map((item) => item.low)).toLocaleString()}</div>
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
