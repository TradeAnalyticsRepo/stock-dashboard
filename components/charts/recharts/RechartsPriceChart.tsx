import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts";
import { StockDataItem } from "@/types";
import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  data: StockDataItem[];
}

/**
 * Recharts를 사용한 주가 라인 차트 컴포넌트
 * - 주가 변동 추이를 시각화
 * - Brush 기능을 통해 사용자가 특정 기간의 데이터를 확대해서 볼 수 있음
 * - 툴팁을 통해 각 데이터 포인트의 정확한 주가 정보를 제공
 * - on/off 가능한 Brush 기능과 예쁜 디자인
 * @param {Props} props - data (주가 데이터)
 * @returns {JSX.Element}
 */
const RechartsPriceChart: React.FC<Props> = ({ data }) => {
  const [brushEnabled, setBrushEnabled] = useState(false);
  const [brushData, setBrushData] = useState<StockDataItem[]>(data);

  // 데이터가 변경될 때 brushData 업데이트
  useEffect(() => {
    setBrushData(data);
  }, [data]);

  if (!data || data.length === 0) {
    return <div className='h-96 flex items-center justify-center text-gray-500'>데이터가 없습니다.</div>;
  }

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
    <div className='h-96 relative'>
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
              ? "bg-red-600 text-white shadow-lg shadow-red-600/25 hover:bg-red-700"
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
            tick={{ fontSize: 12 }}
            // 데이터가 많을 때 X축 라벨 간격 조절
            interval={brushData.length > 30 ? Math.floor(brushData.length / 10) : 0}
          />
          <YAxis
            stroke='#9CA3AF'
            tick={{ fontSize: 12 }}
            tickFormatter={(value: number) => `₩${(value / 1000).toFixed(0)}K`}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1F2937",
              border: "1px solid #374151",
              borderRadius: "8px",
            }}
            formatter={(value: number) => [`₩${value.toLocaleString()}`, "주가"]}
            labelFormatter={(label) => `날짜: ${label}`}
          />
          <Line
            type='monotone'
            dataKey='price'
            stroke='#ef4444'
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#ef4444" }}
            // 부드러운 곡선 효과
            strokeLinecap='round'
            strokeLinejoin='round'
          />

          {/* Brush 컴포넌트 */}
          {brushEnabled && (
            <Brush
              dataKey='date'
              height={30}
              stroke='#ef4444'
              fill='#ef444420'
              startIndex={Math.max(0, data.length - 60)}
              endIndex={data.length - 1}
              onChange={handleBrushChange}
              // 예쁜 디자인 적용
              style={{
                background: "rgba(17, 24, 39, 0.8)",
                backdropFilter: "blur(8px)",
                border: "1px solid #ef444440",
                borderRadius: "8px",
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RechartsPriceChart;
