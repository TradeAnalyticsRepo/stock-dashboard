import React, { useState, useEffect } from 'react';
import { Calendar, X } from 'lucide-react';

/**
 * 커스텀 날짜 범위 선택 컴포넌트
 * - 시작일과 종료일을 각각 독립적으로 선택 가능
 * - 간단하고 직관적인 UI
 * - 기존 기간 버튼과 별개로 동작
 * @param {Props} props - onDateRangeChange, className, startDate, endDate
 * @returns {JSX.Element}
 */
const CustomDatePicker = ({ onDateRangeChange, className = '', startDate: externalStartDate, endDate: externalEndDate }) => {
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
  const initStartDt = tenYearsAgo.toISOString().split('T')[0];
  const initEndDt = new Date().toISOString().split('T')[0];

  // 외부에서 전달받은 값이 있으면 사용, 없으면 기본값 사용
  const [startDate, setStartDate] = useState(externalStartDate || initStartDt);
  const [endDate, setEndDate] = useState(externalEndDate || initEndDt);

  // 외부에서 전달받은 값이 변경되면 내부 state 업데이트
  useEffect(() => {
    if (externalStartDate) {
      setStartDate(externalStartDate);
    }
  }, [externalStartDate]);

  useEffect(() => {
    if (externalEndDate) {
      setEndDate(externalEndDate);
    }
  }, [externalEndDate]);

  // 날짜 변경 핸들러
  const handleStartDateChange = (date) => {
    setStartDate(date);
    if (date && endDate) {
      const start = new Date(date);
      const end = new Date(endDate);
      if (start <= end) {
        onDateRangeChange(start, end);
      }
    }
  };

  const handleEndDateChange = (date) => {
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
    setStartDate(initStartDt);
    setEndDate(initEndDt);
  };

  // 최대 날짜 계산 (오늘)
  const maxDate = new Date().toISOString().split('T')[0];

  return (
      <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
      }}
    >
      {/* 시작일 선택 */}
      <div style={{ flex: 1 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.75rem",
            color: "#a3a3a3",
            marginBottom: "0.25rem",
          }}
        >
          시작일
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="date"
            value={startDate}
            onChange={(e) => handleStartDateChange(e.target.value)}
            max={endDate || maxDate}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "#1f2937",
              border: "1px solid #4b5563",
              borderRadius: "0.5rem",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
              transition: "border 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#4b5563")}
          />
          <Calendar
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "#a3a3a3",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* 구분선 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          color: "#a3a3a3",
          fontSize: "0.875rem",
        }}
      >
        ~
      </div>

      {/* 종료일 선택 */}
      <div style={{ flex: 1 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.75rem",
            color: "#a3a3a3",
            marginBottom: "0.25rem",
          }}
        >
          종료일
        </label>
        <div style={{ position: "relative" }}>
          <input
            type="date"
            value={endDate}
            onChange={(e) => handleEndDateChange(e.target.value)}
            min={startDate}
            max={maxDate}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              background: "#1f2937",
              border: "1px solid #4b5563",
              borderRadius: "0.5rem",
              color: "#fff",
              fontSize: "0.875rem",
              outline: "none",
              transition: "border 0.2s",
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "#4b5563")}
          />
          <Calendar
            style={{
              position: "absolute",
              right: "0.75rem",
              top: "50%",
              transform: "translateY(-50%)",
              width: "1rem",
              height: "1rem",
              color: "#a3a3a3",
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* 초기화 버튼 */}
      {(startDate || endDate) && (
        <button
          onClick={handleClear}
          style={{
            marginTop: "1.5rem",
            padding: "0.5rem",
            border: "none",
            background: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#374151")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
        >
          <X style={{ width: "1rem", height: "1rem", color: "#a3a3a3" }} />
        </button>
      )}
    </div>
  );
};

export default CustomDatePicker;
