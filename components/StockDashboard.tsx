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
import styled from "styled-components";
import { useRouter } from "next/navigation";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;
const Main = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
`;
// Section: grid, flex prop이 DOM에 전달되지 않도록 withConfig 사용
const Section = styled.section.withConfig({
  shouldForwardProp: (prop) => prop !== "grid" && prop !== "flex", // grid, flex는 스타일 계산에만 사용, DOM에는 전달하지 않음
})<{ grid?: boolean; flex?: boolean }>`
  ${(props) =>
    props.grid
      ? `display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 2rem;
        @media (min-width: 768px) { grid-template-columns: repeat(4, 1fr); }
        @media (min-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
      `
      : props.flex
      ? `display: flex; gap: 0.5rem; margin-bottom: 1.5rem;`
      : ""}
`;
const Card = styled.div`
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #27272a;
`;
const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;
const ExcelUpload = styled.div`
  margin-left: auto;
  cursor: pointer;
`;
const HiddenInput = styled.input`
  display: none;
`;

const StockDashboard = () => {
  // const { isClient, stockData, institutionalData, selectedPeriod, setSelectedPeriod, priceChangePercent, currentPrice } = useStockData("1Y");
  // const fileInputRef = useRef<HTMLInputElement>(null);
  // const router = useRouter();
  // // 신규 카드 관련 상태
  // const [addingCard, setAddingCard] = React.useState(false);
  // const [newCardName, setNewCardName] = React.useState("");
  // const [uploadEnabled, setUploadEnabled] = React.useState(false);
  // const [error, setError] = React.useState("");
  // if (!isClient) {
  //   return (
  //     <Wrapper>
  //       <FlexCenter>로딩 중...</FlexCenter>
  //     </Wrapper>
  //   );
  // }
  // const getLatestValue = (data: { value: number }[]) => {
  //   if (data && data.length > 0) {
  //     return data[data.length - 1].value;
  //   }
  //   return 0;
  // };
  // const latestIndividualVolume = getLatestValue(institutionalData.개인);
  // const latestForeignerVolume = getLatestValue(institutionalData.외국인);
  // const latestCombinedForcesVolume = getLatestValue(institutionalData.세력합);
  // const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   try {
  //     const file = e.target.files?.[0];
  //     if (!file) return;
  //     await processingExcelData(file);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };
  // // 엑셀 업로드 핸들러 (신규 카드용)
  // const handleExcelUploadNew = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   try {
  //     const file = e.target.files?.[0];
  //     if (!file || !newCardName) return;
  //     // 파일 존재 여부 확인 API 호출
  //     const res = await fetch(`/api/excel/check?name=${encodeURIComponent(newCardName)}`);
  //     const { exists } = await res.json();
  //     if (exists) {
  //       router.push(`/dashboard/${newCardName}`);
  //     } else {
  //       setError("해당 이름의 파일이 존재하지 않습니다.");
  //     }
  //   } catch {
  //     setError("업로드 중 오류가 발생했습니다.");
  //   }
  // };
  // // 이름 입력 핸들러
  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setNewCardName(e.target.value);
  //   setUploadEnabled(!!e.target.value);
  //   setError("");
  // };
  // // 입력 취소 핸들러
  // const handleCancelAdd = () => {
  //   setAddingCard(false);
  //   setNewCardName("");
  //   setUploadEnabled(false);
  //   setError("");
  // };
  // return (
  //   <Wrapper>
  //     <Header chartType='rechart' />
  //     <Main>
  //       {/* 주요 지표 섹션 */}
  //       <Section grid>
  //         <StatCard
  //           title='현재가'
  //           value={`₩${currentPrice.toLocaleString()}`}
  //           change={priceChangePercent}
  //           icon={Activity}
  //           color='text-red-600'
  //         />
  //         <StatCard
  //           title='개인 매집수량'
  //           value={latestIndividualVolume.toLocaleString()}
  //           icon={Users}
  //           color='text-blue-500'
  //         />
  //         <StatCard
  //           title='외국인 매집수량'
  //           value={latestForeignerVolume.toLocaleString()}
  //           icon={Globe}
  //           color='text-green-500'
  //         />
  //         <StatCard
  //           title='세력합 매집수량'
  //           value={latestCombinedForcesVolume.toLocaleString()}
  //           icon={Building}
  //           color='text-purple-500'
  //         />
  //         {/* 신규 카드 입력 UI (카드 리스트 내에) */}
  //         {addingCard ? (
  //           <Card style={{ minWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>
  //             <input
  //               type='text'
  //               placeholder='이름을 입력하세요'
  //               value={newCardName}
  //               onChange={handleNameChange}
  //               style={{ padding: 8, borderRadius: 4, border: "1px solid #333", background: "#222", color: "#fff" }}
  //               autoFocus
  //             />
  //             <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
  //               <button
  //                 style={{
  //                   background: uploadEnabled ? "#2563eb" : "#555",
  //                   color: "#fff",
  //                   border: "none",
  //                   borderRadius: 4,
  //                   padding: "8px 16px",
  //                   cursor: uploadEnabled ? "pointer" : "not-allowed",
  //                 }}
  //                 disabled={!uploadEnabled}
  //                 onClick={() => fileInputRef.current?.click()}>
  //                 엑셀 업로드
  //               </button>
  //               <button
  //                 style={{
  //                   background: "#333",
  //                   color: "#fff",
  //                   border: "none",
  //                   borderRadius: 4,
  //                   padding: "8px 16px",
  //                   cursor: "pointer",
  //                 }}
  //                 onClick={handleCancelAdd}>
  //                 취소
  //               </button>
  //               <HiddenInput
  //                 type='file'
  //                 accept='.xlsx, .xls'
  //                 ref={fileInputRef}
  //                 onChange={handleExcelUploadNew}
  //               />
  //             </div>
  //             {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
  //           </Card>
  //         ) : (
  //           <Card
  //             style={{ display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", minHeight: 120 }}
  //             onClick={() => setAddingCard(true)}>
  //             <span style={{ fontSize: 32, color: "#888" }}>+</span>
  //           </Card>
  //         )}
  //       </Section>
  //       {/* 기간 선택 버튼 섹션 */}
  //       <Section flex>
  //         {PERIODS.map((period) => (
  //           <PeriodButton
  //             key={period}
  //             period={period}
  //             active={selectedPeriod === period}
  //             onClick={setSelectedPeriod}
  //           />
  //         ))}
  //         <ExcelUpload
  //           onClick={() => {
  //             fileInputRef.current?.click();
  //           }}>
  //           엑셀업로드
  //           <HiddenInput
  //             type='file'
  //             accept='.xlsx, .xls'
  //             ref={fileInputRef}
  //             onChange={handleExcelUpload}
  //           />
  //         </ExcelUpload>
  //       </Section>
  //       {/* 차트 그리드 섹션 */}
  //       <Section grid>
  //         <Card style={{ gridColumn: "span 2" }}>
  //           <ChartTitle>
  //             <Activity style={{ color: "#dc2626", marginRight: 8 }} />
  //             주가 차트 (캔들스틱)
  //           </ChartTitle>
  //           <RechartsPriceChart data={stockData} />
  //         </Card>
  //         <div style={{ gridColumn: "span 2" }}>
  //           <AveragePriceCard
  //             data={stockData}
  //             period={selectedPeriod}
  //           />
  //         </div>
  //         {Object.keys(institutionalData).map((key) => (
  //           <Card key={key}>
  //             <ChartTitle>
  //               <Users style={{ color: LINE_CHART_COLORS[key], marginRight: 8 }} />
  //               {key} 매집수량
  //             </ChartTitle>
  //             <RechartsShareholderChart
  //               data={institutionalData[key]}
  //               color={LINE_CHART_COLORS[key] || "#ffffff"}
  //               title={key}
  //             />
  //           </Card>
  //         ))}
  //       </Section>
  //     </Main>
  //   </Wrapper>
  // );
};

const FlexCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default StockDashboard;
