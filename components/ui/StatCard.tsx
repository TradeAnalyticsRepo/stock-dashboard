
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { StatCardProps } from '@/types';

/**
 * 주요 지표를 표시하는 통계 카드 컴포넌트
 * @param {StatCardProps} props - title, value, change, icon, color
 * @returns {JSX.Element}
 */
const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => (
  <div className='bg-gray-900 rounded-lg p-6 border border-gray-800'>
    <div className='flex items-center justify-between'>
      <div>
        <p className='text-gray-400 text-sm'>{title}</p>
        <p className='text-2xl font-bold text-white mt-1'>{value}</p>
        {change !== undefined && (
          <div className={`flex items-center mt-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className='ml-1 text-sm'>{Math.abs(change).toFixed(2)}%</span>
          </div>
        )}
      </div>
      <Icon className={`${color} w-8 h-8`} />
    </div>
  </div>
);

export default StatCard;
