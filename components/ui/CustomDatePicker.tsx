import React, { useState, useRef, useEffect } from "react";
import { Calendar, X } from "lucide-react";

interface Props {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

/**
 * 커스텀 날짜 범위 선택 컴포넌트
 * - 시작일과 종료일을 각각 독립적으로 선택 가능
 * - 간단하고 직관적인 UI
 * - 기존 기간 버튼과 별개로 동작
 * @param {Props} props - onDateRangeChange, className
 * @returns {JSX.Element}
 */
const CustomDatePicker: React.FC<Props> = ({ onDateRangeChange, className = "" }) => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);

  // 날짜 변경 핸들러
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    if (date && endDate) {
      const start = new Date(date);
      const end = new Date(endDate);
      if (start <= end) {
        onDateRangeChange(start, end);
      }
    }
  };

  const handleEndDateChange = (date: string) => {
    setEndDate(date);
    if (startDate && date) {
      const start = new Date(startDate);
      const end = new Date(date);
      if (start <= end) {
        onDateRangeChange(start, end);
      }
    }
  };

  // 날짜 범위 초기화
  const handleClear = () => {
    setStartDate("");
    setEndDate(new Date().toISOString().split("T")[0]);
  };

  // 최대 날짜 계산 (오늘)
  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 시작일 선택 */}
      <div className='flex-1'>
        <label className='block text-xs text-gray-400 mb-1'>시작일</label>
        <div className='relative'>
          <input
            type='date'
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            max={endDate || maxDate}
            className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors'
          />
          <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
        </div>
      </div>

      {/* 구분선 */}
      <div className='flex items-center'>
        <span className='text-gray-400 text-sm'>~</span>
      </div>

      {/* 종료일 선택 */}
      <div className='flex-1'>
        <label className='block text-xs text-gray-400 mb-1'>종료일</label>
        <div className='relative'>
          <input
            type='date'
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate}
            max={maxDate}
            className='w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition-colors'
          />
          <Calendar className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
        </div>
      </div>

      {/* 초기화 버튼 */}
      {(startDate || endDate) && (
        <button
          onClick={handleClear}
          className='mt-6 p-2 hover:bg-gray-700 rounded-lg transition-colors'>
          <X className='w-4 h-4 text-gray-400' />
        </button>
      )}
    </div>
  );
};

export default CustomDatePicker;
