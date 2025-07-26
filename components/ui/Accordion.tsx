'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

const AccordionWrapper = styled.div`
  background: #1a1a1a;
  border-radius: 0.5rem;
  border: 1px solid #27272a;
`;

const AccordionHeader = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  color: #fff;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 600;
  text-align: left;
`;

const AccordionContent = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  padding: ${(props) => (props.isOpen ? '0 1.5rem 1.5rem' : '0 1.5rem')};
  max-height: ${(props) => (props.isOpen ? '1000px' : '0')};
  overflow: hidden;
`;

const ChevronIcon = styled(ChevronDown).withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})<{ isOpen: boolean }>`
  transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  flex-shrink: 0;
  margin-left: 1rem;
`;

interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <AccordionWrapper>
      <AccordionHeader onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>{title}</div>
        <ChevronIcon
          isOpen={isOpen}
          size={24}
        />
      </AccordionHeader>
      <AccordionContent isOpen={isOpen}>
        <div style={{ paddingTop: isOpen ? '1rem' : '0' }}>{children}</div>
      </AccordionContent>
    </AccordionWrapper>
  );
};

export default Accordion;
