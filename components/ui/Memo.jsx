'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Save } from 'lucide-react';

const MemoContainer = styled.div`
  background: #1a1a1a;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
`;

const MemoHeader = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
`;

const MemoTextarea = styled.textarea`
  height: 400px;
  flex-grow: 1;

  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;

const SaveButton = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: #1d4ed8;
    filter: brightness(1.1);
  }
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: flex-end;
`;

const ConfirmationMessage = styled.div`
  position: absolute;
  top: -2.5rem;
  right: 0;
  background: #2563eb;
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  white-space: nowrap;

  &.show {
    opacity: 1;
  }
`;

const Memo = ({ memo, onSave }) => {
  const [currentMemo, setCurrentMemo] = useState(memo);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    setCurrentMemo(memo);
  }, [memo]);

  const handleSave = () => {
    onSave(currentMemo);
    setShowConfirmation(true);
    setTimeout(() => {
      setShowConfirmation(false);
    }, 2000);
  };

  return (
    <MemoContainer>
      <MemoHeader>메모</MemoHeader>
      <MemoTextarea
        spellCheck="false"
        value={currentMemo}
        onChange={(e) => setCurrentMemo(e.target.value)}
        placeholder="여기에 메모를 입력하세요..."
      />
      <ButtonContainer>
        <SaveButton onClick={handleSave}>
          <Save size={16} />
          저장
        </SaveButton>
        <ConfirmationMessage className={showConfirmation ? 'show' : ''}>
          저장되었습니다!
        </ConfirmationMessage>
      </ButtonContainer>
    </MemoContainer>
  );
};

export default Memo;