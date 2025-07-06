
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { StockDataItem } from '@/types';

interface Props {
  data: StockDataItem[];
}

/**
 * Recharts를 사용한 주가 라인 차트 컴포넌트
 * - 주가 변동 추이를 시각화
 * - Brush 기능을 통해 사용자가 특정 기간의 데이터를 확대해서 볼 수 있음
 * - 툴팁을 통해 각 데이터 포인트의 정확한 주가 정보를 제공
 * @param {Props} props - data (주가 데이터)
 * @returns {JSX.Element}
 */
const RechartsPriceChart: React.FC<Props> = ({ data }) => (
  <div className='h-96'>
    <ResponsiveContainer width='100%' height='100%'>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
        <XAxis dataKey='date' stroke='#9CA3AF' tick={{ fontSize: 12 }} />
        <YAxis
          stroke='#9CA3AF'
          tick={{ fontSize: 12 }}
          tickFormatter={(value: number) => `₩${(value / 1000).toFixed(0)}K`}
          domain={['auto', 'auto']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1F2937',
            border: '1px solid #374151',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`₩${value.toLocaleString()}`, '주가']}
        />
        <Line
          type='monotone'
          dataKey='price'
          stroke='#ef4444'
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6, fill: '#ef4444' }}
        />
        <Brush
          dataKey='date'
          height={30}
          stroke='#ef4444'
          startIndex={Math.max(0, data.length - 60)}
          endIndex={data.length - 1}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default RechartsPriceChart;
