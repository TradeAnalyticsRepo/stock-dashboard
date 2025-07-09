import React from 'react';
import styled, { css } from 'styled-components';
import { PeriodButtonProps } from '@/types';

// StyledButton: active prop이 DOM에 전달되지 않도록 withConfig 사용
const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active', // active는 스타일 계산에만 사용, DOM에는 전달하지 않음
})<{ active: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  outline: none;
  border: none;
  cursor: pointer;
  ${(props) =>
    props.active
      ? css`
          background: #dc2626;
          color: #fff;
        `
      : css`
          background: #1f2937;
          color: #d1d5db;
          &:hover {
            background: #374151;
          }
        `}
`;

const PeriodButton: React.FC<PeriodButtonProps> = ({ period, active, onClick }) => (
  <StyledButton
    active={active}
    onClick={() => onClick(period)}>
    {period}
  </StyledButton>
);

export default PeriodButton;
