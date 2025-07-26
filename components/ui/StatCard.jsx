import React from 'react';
import styled from 'styled-components';
import { TrendingUp, TrendingDown } from 'lucide-react';

// 스타일드 컴포넌트 정의
const Card = styled.div`
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #27272a;
`;
const CardFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.p`
  color: #a3a3a3;
  font-size: 0.875rem;
`;
const Value = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  margin-top: 0.25rem;
`;
// Change: positive prop이 DOM에 전달되지 않도록 withConfig 사용
const Change = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'positive', // positive는 스타일 계산에만 사용, DOM에는 전달하지 않음
})`
  display: flex;
  align-items: center;
  margin-top: 0.5rem;
  color: ${(props) => (props.positive ? '#22c55e' : '#ef4444')};
`;
const IconWrapper = styled.div`
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  /* color prop은 직접 적용하지 않고, 부모에서 아이콘에 전달 */
`;

/**
 * 주요 지표를 표시하는 통계 카드 컴포넌트
 * @param {StatCardProps} props - title, value, change, icon, color
 * @returns {JSX.Element}
 */
const StatCard = ({ title, value, change, icon: Icon, color }) => (
  <Card>
    <CardFlex>
      <div>
        <Title>{title}</Title>
        <Value>{value}</Value>
        {change !== undefined && (
          <Change positive={change >= 0}>
            {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span style={{ marginLeft: '0.25rem', fontSize: '0.875rem' }}>{Math.abs(change).toFixed(2)}%</span>
          </Change>
        )}
      </div>
      <IconWrapper>
        <Icon className={color + ' w-8 h-8'} />
      </IconWrapper>
    </CardFlex>
  </Card>
);

export default StatCard;
