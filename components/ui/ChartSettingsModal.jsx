
import React from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1e1e1e;
  color: #fff;
  padding: 2rem;
  border-radius: 0.5rem;
  width: 90%;
  max-width: 500px;
  border: 1px solid #3f3f46;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
`;

const ChartList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChartItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 0.25rem;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2a2a2a;
  }
`;

const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
`;

const ChartSettingsModal = ({ isOpen, onClose, availableCharts, selectedCharts, onChartSelectionChange }) => {
  if (!isOpen) return null;

  const handleCheckboxChange = (chartName) => {
    const isSelected = selectedCharts.includes(chartName);
    let newSelectedCharts;
    if (isSelected) {
      newSelectedCharts = selectedCharts.filter(name => name !== chartName);
    } else {
      newSelectedCharts = [...selectedCharts, chartName];
    }
    onChartSelectionChange(newSelectedCharts);
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>차트 설정</ModalTitle>
          <CloseButton onClick={onClose}>
            <X size={24} />
          </CloseButton>
        </ModalHeader>
        <ChartList>
          {availableCharts.map(chartName => (
            <ChartItem key={chartName}>
              <Checkbox
                type="checkbox"
                checked={selectedCharts.includes(chartName)}
                onChange={() => handleCheckboxChange(chartName)}
              />
              {chartName}
            </ChartItem>
          ))}
        </ChartList>
      </ModalContent>
    </ModalBackdrop>
  );
};

export default ChartSettingsModal;
