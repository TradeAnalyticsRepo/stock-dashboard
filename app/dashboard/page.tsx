'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import styled from 'styled-components';
import Header from '@/components/Header';
import StatCard from '@/components/ui/StatCard';
import { Activity } from 'lucide-react';
import { processingExcelData } from '../utils/excelUtils';
import { callGetApi } from '../utils/api';
import { stockCard } from '@/types';

// styled-components 정의
const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;
const Main = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
`;
const Section = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;
const CardWrapper = styled.div`
  cursor: pointer;
`;
const EmptyCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #52525b;
  border-radius: 0.5rem;
  cursor: pointer;
  min-height: 120px;
`;
const HiddenInput = styled.input`
  display: none;
`;

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stocks, setStocks] = useState<stockCard[]>([]); 
  useEffect(() => {
    const stockFiles = async () => {
      try {
        const result = await callGetApi('/api/getExcelFiles', null);
        if(result?.data){

          console.log(result.data);
        setStocks(result.data.stocks);
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    stockFiles(); // async 함수 호출
  }, []); 
  // 예시 종목 데이터
  // const stocks = [
  //   { name: '삼성전자', price: 10000, change: 0.54 },
  //   { name: 'LG화학', price: 20000, change: -0.12 },
  //   { name: 'NAVER', price: 15000, change: 1.23 },
  //   { name: '카카오', price: 12000, change: -0.45 },
  // ];

  const handleCardClick = (stock: stockCard) => {
    router.push(`/lightweight?name=${encodeURIComponent(stock.name)}`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
      if (!file) return;

      
      await processingExcelData(file);
    // 엑셀 업로드 처리 로직 (추후 구현)
  };

  return (
    <Wrapper>
      <Header chartType='rechart' />
      <Main>
        {/* 주요 지표 섹션 */}
        <Section>
          {stocks.map((stock, idx) => (
            <CardWrapper
              key={idx}
              onClick={() => handleCardClick(stock)}>
              <StatCard
                title={stock.name}
                value={`₩${stock.price.toLocaleString()}`}
                change={stock.change}
                icon={Activity}
                color={stock.change > 0 ? 'text-red-600' : 'text-blue-600'}
              />
            </CardWrapper>
          ))}
          {/* 빈 카드 (엑셀 업로드) */}
          <EmptyCard onClick={handleUploadClick}>
            <Plus size={40} />
            <HiddenInput
              type='file'
              accept='.xlsx,.xls'
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </EmptyCard>
        </Section>
      </Main>
    </Wrapper>
  );
}


