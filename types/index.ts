import { LucideIcon } from "lucide-react";

/**
 * 주식 데이터 항목을 나타내는 인터페이스
 */
export interface StockDataItem {
  date: string; // 날짜 (YYYY-MM-DD 또는 YYYY-MM 형식)
  price: number; // 종가
  open: number; // 시가
  high: number; // 고가
  low: number; // 저가
  close: number; // 종가
  previousDayComparison: number; // 전일대비
}

/**
 * 주주 데이터 항목을 나타내는 인터페이스
 */
export interface ShareholderDataItem {
  date: string; // 날짜 (YYYY-MM-DD 또는 YYYY-MM 형식)
  percentage: number; // 보유율 (%)
  volume: number; // 보유량
}

/**
 * 통계 카드 컴포넌트의 props를 정의하는 인터페이스
 */
export interface StatCardProps {
  title: string; // 카드 제목
  value: string; // 표시될 값
  change?: number; // 변화율 (옵션)
  icon: LucideIcon; // lucide-react 아이콘
  color: string; // 아이콘 색상 클래스
}

/**
 * 기간 선택 버튼 컴포넌트의 props를 정의하는 인터페이스
 */
export interface PeriodButtonProps {
  period: string; // 기간 (예: "6M", "1Y")
  active: boolean; // 활성화 여부
  onClick: (period: string) => void; // 클릭 핸들러
}
