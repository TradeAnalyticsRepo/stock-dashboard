import { LucideIcon } from "lucide-react";
import { Period } from "./constants";

/**
 * `11111_graph.json` 파일의 원본 데이터 항목의 타입
 */
export interface RawData {
  주가: {
    tradeDate: string; // "YYYY/MM/DD"
    open: number;
    high: number;
    low: number;
    close: number;
    previousDayComparison: number;
  };
  // '개인', '외국인' 등 다른 투자자 키를 포함
  [key: string]: any;
}

/**
 * 주가 데이터 항목 (캔들스틱 차트용)
 */
export interface StockDataItem {
  date: string; // 날짜 (YYYY-MM-DD)
  open: number;
  high: number;
  low: number;
  close: number;
  previousDayComparison: number;
}

/**
 * 투자자별 매집량 데이터 항목 (라인 차트용)
 */
export interface VolumeDataItem {
  date: string; // 날짜 (YYYY-MM-DD)
  value: number; // 매집량
}

/**
 * 기관 및 개인 투자자별 매집량 데이터
 */
export interface InstitutionalData {
  [key: string]: VolumeDataItem[];
}

/**
 * 통계 카드 컴포넌트의 props
 */
export interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  icon: LucideIcon;
  color: string;
}

/**
 * 기간 선택 버튼 컴포넌트의 props
 */
export interface PeriodButtonProps {
  period: Period;
  active: boolean;
  onClick: (period: Period) => void;
}

/** 
 * 대시보드 stock리스트
 */ 
export interface stockCard {
  name: string; 
  price: number; 
  change: number
}