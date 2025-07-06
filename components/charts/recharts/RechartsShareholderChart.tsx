import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { ShareholderData } from "@/components/hooks/useStockData";
import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  data: ShareholderData[];
  color: string;
  title: string;
}

/**
 * Recharts를 사용한 주주 보유 현황 라인 차트 컴포넌트
 * - 개인, 외국인, 기관 등 각 주주 유형별 매집수량 변화를 시각화
 * - 툴팁을 통해 각 시점의 정확한 매집수량을 확인
 * - 데이터가 많을 때는 dot을 숨겨서 UI를 깔끔하게 유지
 * - Brush 기능으로 드래그하여 차트 영역을 확대/축소 가능
 * @param {Props} props - data, color, title
 * @returns {JSX.Element}
 */
const RechartsShareholderChart: React.FC<Props> = ({ data, color, title }) => {
  const [brushEnabled, setBrushEnabled] = useState(false);
  const [brushData, setBrushData] = useState<ShareholderData[]>(data);

  // 데이터가 변경될 때 brushData 업데이트
  useEffect(() => {
    setBrushData(data);
  }, [data]);

  if (!data || data.length === 0) {
    return <div className='h-80 flex items-center justify-center text-gray-500'>데이터가 없습니다.</div>;
  }

  // 데이터 개수에 따라 dot 표시 여부와 크기 결정
  const shouldShowDots = data.length <= 50; // 50개 이하일 때만 dot 표시
  const dotSize = data.length <= 20 ? 4 : data.length <= 50 ? 3 : 0;

  // Brush 데이터 변경 핸들러
  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.length > 0) {
      setBrushData(brushData);
    } else {
      // Brush가 비어있으면 전체 데이터로 리셋
      setBrushData(data);
    }
  };

  return (
    <div className='h-80 relative'>
      {/* Brush 토글 버튼 */}
      <div className='absolute top-2 right-2 z-10'>
        <button
          onClick={() => {
            setBrushEnabled(!brushEnabled);
            if (!brushEnabled) {
              // Brush를 켤 때 전체 데이터로 리셋
              setBrushData(data);
            }
          }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            brushEnabled
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
          }`}
          title={brushEnabled ? "Brush 기능 비활성화" : "Brush 기능 활성화"}>
          {brushEnabled ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
          {brushEnabled ? "Brush ON" : "Brush OFF"}
        </button>
      </div>

      <ResponsiveContainer
        width='100%'
        height='100%'>
        <LineChart data={brushData}>
          <CartesianGrid
            strokeDasharray='3 3'
            stroke='#374151'
          />
          <XAxis
            dataKey='date'
            stroke='#9CA3AF'
            tick={{ fontSize: 10 }}
            // 데이터가 많을 때 X축 라벨 간격 조절
            interval={brushData.length > 30 ? Math.floor(brushData.length / 10) : 0}
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
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Line
            type='monotone'
            dataKey='value'
            stroke={color}
            strokeWidth={2}
            // 조건부로 dot 표시
            dot={shouldShowDots ? { fill: color, strokeWidth: 2, r: dotSize } : false}
            activeDot={{ r: 6, fill: color }}
            // 부드러운 곡선 효과
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Brush 컴포넌트 */}
          {brushEnabled && (
            <Brush
              dataKey='date'
              height={30}
              stroke={color}
              fill={`${color}20`}
              startIndex={Math.max(0, data.length - 60)}
              endIndex={data.length - 1}
              onChange={handleBrushChange}
              // 예쁜 디자인 적용
              style={{
                background: "rgba(17, 24, 39, 0.8)",
                backdropFilter: "blur(8px)",
                border: `1px solid ${color}40`,
                borderRadius: "8px",
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsShareholderChart;
