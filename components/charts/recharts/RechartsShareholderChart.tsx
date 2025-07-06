import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ShareholderData } from "@/components/hooks/useStockData";

interface Props {
  data: ShareholderData[];
  color: string;
  title: string;
}

/**
 * Recharts를 사용한 주주 보유 현황 라인 차트 컴포넌트
 * - 개인, 외국인, 기관 등 각 주주 유형별 매집수량 변화를 시각화
 * - 툴팁을 통해 각 시점의 정확한 매집수량을 확인
 * @param {Props} props - data, color, title
 * @returns {JSX.Element}
 */
const RechartsShareholderChart: React.FC<Props> = ({ data, color, title }) => {
  if (!data || data.length === 0) {
    return <div className='h-80 flex items-center justify-center text-gray-500'>데이터가 없습니다.</div>;
  }

  return (
    <div className='h-80'>
      <ResponsiveContainer
        width='100%'
        height='100%'>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#374151'
          />
          <XAxis
            dataKey='date'
            stroke='#9CA3AF'
            tick={{ fontSize: 10 }}
          />
          <YAxis
            stroke='#9CA3AF'
            tick={{ fontSize: 10 }}
            tickFormatter={(value: number) => value.toLocaleString()}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [value.toLocaleString(), title]}
          />
          <Line
            type='monotone'
            dataKey='value'
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: color }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsShareholderChart;
