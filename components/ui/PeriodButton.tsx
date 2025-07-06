
import React from 'react';
import { PeriodButtonProps } from '@/types';

/**
 * 차트 데이터 기간 선택 버튼 컴포넌트
 * @param {PeriodButtonProps} props - period, active, onClick
 * @returns {JSX.Element}
 */
const PeriodButton: React.FC<PeriodButtonProps> = ({ period, active, onClick }) => (
  <button
    onClick={() => onClick(period)}
    className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
      active ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    }`}>
    {period}
  </button>
);

export default PeriodButton;
