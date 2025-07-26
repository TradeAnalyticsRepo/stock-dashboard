import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import CustomDatePicker from './CustomDatePicker';
import styled, { css } from 'styled-components';

const Card = styled.div`
  background: linear-gradient(135deg, #18181b 0%, #27272a 50%, #18181b 100%);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid #374151;
  box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(2px);
`;
const FlexBetween = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
const Flex = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;
const IconBox = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  background: ${({ bg }) => bg || 'rgba(37,99,235,0.12)'};
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
`;
const Sub = styled.p`
  font-size: 0.875rem;
  color: #a3a3a3;
`;
// ChangeBox: positive prop이 DOM에 전달되지 않도록 withConfig 사용
const ChangeBox = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'positive', // positive는 스타일 계산에만 사용, DOM에는 전달하지 않음
})`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid;
  ${({ positive }) =>
    positive
      ? css`
          background: rgba(22, 163, 74, 0.12);
          color: #4ade80;
          border-color: rgba(22, 163, 74, 0.2);
        `
      : css`
          background: rgba(220, 38, 38, 0.12);
          color: #f87171;
          border-color: rgba(220, 38, 38, 0.2);
        `}
`;
const MainValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #fff;
  margin-bottom: 0.25rem;
`;
const SubValue = styled.div`
  font-size: 0.875rem;
  color: #a3a3a3;
`;
const CustomRangeBox = styled.div`
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(31, 41, 55, 0.5);
  border-radius: 0.75rem;
  border: 1px solid #4b5563;
`;
const CustomRangeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;
const CustomRangeTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #d1d5db;
  font-size: 0.875rem;
  font-weight: 500;
`;
const ResetButton = styled.button`
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #1e293b;
  background: #fbbf24;
  border: 1px solid #f59e42;
  border-radius: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    background: #fde68a;
    box-shadow: 0 2px 8px 0 rgba(251, 191, 36, 0.15);
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.97);
  }
`;
const CustomRangeInfo = styled.div`
  font-size: 0.75rem;
  color: #a3a3a3;
`;
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #374151;
`;
const GridLabel = styled.div`
  font-size: 0.875rem;
  color: #a3a3a3;
  margin-bottom: 0.25rem;
`;
const GridValue = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ color }) => color || '#fff'};
`;
const IndicatorRow = styled.div`
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const IndicatorBarWrap = styled.div`
  flex: 1;
  height: 0.5rem;
  background: #374151;
  border-radius: 9999px;
  overflow: hidden;
`;
// IndicatorBar: positive prop이 DOM에 전달되지 않도록 withConfig 사용
const IndicatorBar = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'positive' && prop !== 'width', // positive, width 모두 DOM에 전달하지 않음
})`
  height: 100%;
  border-radius: 9999px;
  transition: width 0.5s;
  background: ${({ positive }) =>
    positive ? 'linear-gradient(90deg, #22d3ee 0%, #4ade80 100%)' : 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)'};
  width: ${({ width }) => width}%;
`;
const IndicatorText = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
  min-width: 60px;
  text-align: right;
`;

/**
 * 기간별 평균 단가를 표시하는 카드 컴포넌트
 * - 선택된 기간의 평균 단가 계산
 * - 전체 기간 대비 변화율 표시
 * - 커스텀 날짜 범위 선택 가능
 * - 예쁜 디자인과 애니메이션 효과
 * @param {Props} props - data, period
 * @returns {JSX.Element}
 */
const AveragePriceCard = ({ data, period }) => {
  const [customDateRange, setCustomDateRange] = useState(null);
  const [useCustomRange, setUseCustomRange] = useState(false);

  if (!data || data.length === 0) {
    return (
      <Card>
        <Flex>
          <IconBox bg='rgba(75,85,99,0.12)'>
            <DollarSign
              color='#a3a3a3'
              size={20}
            />
          </IconBox>
          <div>
            <Title style={{ color: '#a3a3a3' }}>평균 단가</Title>
            <Sub>데이터가 없습니다</Sub>
          </div>
        </Flex>
      </Card>
    );
  }

  // 계산할 데이터 결정
  let calculationData = data;
  let calculationPeriod = period;

  if (useCustomRange && customDateRange) {
    calculationData = data.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= customDateRange.startDate && itemDate <= customDateRange.endDate;
    });
    calculationPeriod = 'custom';
    if (calculationData.length === 0) {
      calculationData = data;
      calculationPeriod = period;
    }
  }

  const averagePrice =
    calculationData.length > 0 ? Math.round(calculationData.reduce((sum, item) => sum + item.close, 0) / calculationData.length) : 0;
  const allTimeAverage = data.length > 0 ? Math.round(data.reduce((sum, item) => sum + item.close, 0) / data.length) : 0;
  const changePercent = allTimeAverage > 0 ? ((averagePrice - allTimeAverage) / allTimeAverage) * 100 : 0;
  const isPositive = changePercent >= 0;

  const getPeriodLabel = (period) => {
    switch (period) {
      case '6M':
        return '6개월';
      case '1Y':
        return '1년';
      case '2Y':
        return '2년';
      case '5Y':
        return '5년';
      case 'custom':
        return '선택 기간';
      default:
        return period;
    }
  };

  const dataPoints = calculationData.length;

  const handleCustomDateRangeChange = (startDate, endDate) => {
    setCustomDateRange({ startDate, endDate });
    setUseCustomRange(true);
  };
  const handleResetCustomRange = () => {
    setCustomDateRange(null);
    setUseCustomRange(false);
  };

  return (
    <Card>
      <FlexBetween>
        <Flex>
          <IconBox bg='rgba(37,99,235,0.12)'>
            <DollarSign
              color='#38bdf8'
              size={20}
            />
          </IconBox>
          <div>
            <Title>{getPeriodLabel(calculationPeriod)} 평균 단가</Title>
            <Sub>{dataPoints}개 거래일 기준</Sub>
          </div>
        </Flex>
        <ChangeBox positive={isPositive}>
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {Math.abs(changePercent).toFixed(1)}%
        </ChangeBox>
      </FlexBetween>
      <div style={{ marginBottom: '1rem' }}>
        <MainValue>₩{averagePrice.toLocaleString()}</MainValue>
        <SubValue>전체 기간 평균: ₩{allTimeAverage.toLocaleString()}</SubValue>
      </div>
      <CustomRangeBox>
        <CustomRangeHeader>
          <CustomRangeTitle>
            <Calendar
              color='#a3a3a3'
              size={16}
            />
            <span>커스텀 기간 선택</span>
          </CustomRangeTitle>
          {useCustomRange && <ResetButton onClick={handleResetCustomRange}>기본 기간으로</ResetButton>}
        </CustomRangeHeader>
        <Flex style={{ marginBottom: 0 }}>
          <CustomDatePicker
            onDateRangeChange={handleCustomDateRangeChange}
            className='flex-1'
          />
          {useCustomRange && customDateRange && (
            <CustomRangeInfo>
              {customDateRange.startDate.toLocaleDateString('ko-KR')} ~ {customDateRange.endDate.toLocaleDateString('ko-KR')}
            </CustomRangeInfo>
          )}
        </Flex>
      </CustomRangeBox>
      <Grid>
        <div>
          <GridLabel>최고가</GridLabel>
          <GridValue color='#4ade80'>
            ₩{calculationData.length > 0 ? Math.max(...calculationData.map((item) => item.high)).toLocaleString() : '0'}
          </GridValue>
        </div>
        <div>
          <GridLabel>최저가</GridLabel>
          <GridValue color='#f87171'>
            ₩{calculationData.length > 0 ? Math.min(...calculationData.map((item) => item.low)).toLocaleString() : '0'}
          </GridValue>
        </div>
      </Grid>
      <IndicatorRow>
        <IndicatorBarWrap>
          <IndicatorBar
            positive={isPositive}
            width={Math.min(Math.abs(changePercent) * 2, 100)}
          />
        </IndicatorBarWrap>
        <IndicatorText>{isPositive ? '상승' : '하락'}</IndicatorText>
      </IndicatorRow>
    </Card>
  );
};

export default AveragePriceCard;
