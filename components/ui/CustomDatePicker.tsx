import React, { useState, useRef, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';
import styled from 'styled-components';

interface Props {
  onDateRangeChange: (startDate: Date, endDate: Date) => void;
  className?: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const DateCol = styled.div`
  flex: 1;
`;
const Label = styled.label`
  display: block;
  font-size: 0.75rem;
  color: #a3a3a3;
  margin-bottom: 0.25rem;
`;
const InputWrapper = styled.div`
  position: relative;
`;
const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  background: #1f2937;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  color: #fff;
  font-size: 0.875rem;
  outline: none;
  transition: border 0.2s;
  &:focus {
    border-color: #3b82f6;
  }
`;
const CalendarIcon = styled(Calendar)`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  color: #a3a3a3;
  pointer-events: none;
`;
const Divider = styled.div`
  display: flex;
  align-items: center;
  color: #a3a3a3;
  font-size: 0.875rem;
`;
const ClearButton = styled.button`
  margin-top: 1.5rem;
  padding: 0.5rem;
  border: none;
  background: none;
  border-radius: 0.5rem;
  transition: background 0.2s;
  cursor: pointer;
  &:hover {
    background: #374151;
  }
`;
const XIcon = styled(X)`
  width: 1rem;
  height: 1rem;
  color: #a3a3a3;
`;

/**
 * 커스텀 날짜 범위 선택 컴포넌트
 * - 시작일과 종료일을 각각 독립적으로 선택 가능
 * - 간단하고 직관적인 UI
 * - 기존 기간 버튼과 별개로 동작
 * @param {Props} props - onDateRangeChange, className
 * @returns {JSX.Element}
 */
const CustomDatePicker: React.FC<Props> = ({ onDateRangeChange, className = '' }) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);

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
    setStartDate('');
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  // 최대 날짜 계산 (오늘)
  const maxDate = new Date().toISOString().split('T')[0];

  return (
    <Wrapper className={className}>
      {/* 시작일 선택 */}
      <DateCol>
        <Label>시작일</Label>
        <InputWrapper>
          <Input
            type='date'
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            max={endDate || maxDate}
          />
          <CalendarIcon />
        </InputWrapper>
      </DateCol>
      {/* 구분선 */}
      <Divider>~</Divider>
      {/* 종료일 선택 */}
      <DateCol>
        <Label>종료일</Label>
        <InputWrapper>
          <Input
            type='date'
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate}
            max={maxDate}
          />
          <CalendarIcon />
        </InputWrapper>
      </DateCol>
      {/* 초기화 버튼 */}
      {(startDate || endDate) && (
        <ClearButton onClick={handleClear}>
          <XIcon />
        </ClearButton>
      )}
    </Wrapper>
  );
};

export default CustomDatePicker;
