"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import styled, { keyframes } from "styled-components";
import Header from "@/components/Header";
import StatCard from "@/components/ui/StatCard";
import { Activity } from "lucide-react";
import { processingExcelData } from "../utils/excelUtils";
import { callGetApi } from "../utils/api";
import { stockCard } from "@/types";

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
  &:hover {
    border: 2px dashed #dbdbe9;
    transition: 0.5s;
  }
`;
const HiddenInput = styled.input`
  display: none;
`;

const NewCardInputForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #52525b;
  border-radius: 0.5rem;
  background-color: #1a1a1a;
  min-height: 120px;
`;

const NameInput = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #333;
  background: #222;
  color: #fff;
`;

const SaveButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  background-color: #2563eb;
  color: #fff;
  cursor: pointer;
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const LoadingSpinner = styled(Loader2)`
  animation: ${spin} 1s linear infinite;
`;

const ErrorMessage = styled.div`
  color: #ef4444;
  text-align: center;
  padding: 1rem;
`;

/**
 * 종목 리스트
 *
 * 빈 카드 클릭시 -> 빈 카드 생성. -> 해당 카드 클릭하면 엑셀 업로드 가능.
 * 빈 카드 생성 후 이름 지정 가능. 이 때 지정된 이름은 파일명이 됌.
 *
 * 이미 엑셀 등록된 카드의 경우 클릭 시 -> 차트 화면으로 이동.
 */
export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stocks, setStocks] = useState<stockCard[]>([]);
  const [editingCard, setEditingCard] = useState<{
    index: number;
    name: string;
  } | null>(null);
  const [selectedStockIndex, setSelectedStockIndex] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await callGetApi("/api/getExcelFiles", null);
      if (result?.data) {
        setStocks(result.data.stocks);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
      setError("종목 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockFiles();
  }, []);

  const handleCardClick = (stock: stockCard, index: number) => {
    if (stock.price === 0 && stock.name) {
      // 데이터가 없는 신규 카드 -> 파일 업로드 트리거
      setSelectedStockIndex(index);
      fileInputRef.current?.click();
    } else if (stock.name) {
      // 데이터가 있는 기존 카드 -> 차트 페이지로 이동
      router.push(`/lightweight?name=${encodeURIComponent(stock.name)}`);
    }
    // 이름이 없는 카드는 아무 동작 안함
  };

  const handleAddCard = () => {
    const newStocks = [...stocks, { name: "", change: 0, price: 0 }];
    setStocks(newStocks);
    setEditingCard({ index: newStocks.length - 1, name: "" });
  };

  const handleSaveName = () => {
    if (!editingCard || !editingCard.name.trim()) return;
    const updatedStocks = [...stocks];
    updatedStocks[editingCard.index].name = editingCard.name.trim();
    setStocks(updatedStocks);
    setEditingCard(null);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || selectedStockIndex === null) return;

    const stockName = stocks[selectedStockIndex].name;
    if (!stockName) {
      console.error("Stock name is not defined.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await processingExcelData(file, stockName);
      // 업로드 성공 후 데이터 다시 불러오기
      await fetchStockFiles();
    } catch (error) {
      console.error("Error processing excel file:", error);
      setError("엑셀 파일 처리 중 오류가 발생했습니다. 파일 형식을 확인해주세요.");
    } finally {
      // 초기화
      setSelectedStockIndex(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsLoading(false);
    }
  };

  return (
    <Wrapper>
      <Header chartType='rechart' />
      <Main>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
            <LoadingSpinner size={40} />
          </div>
        )}
        {!isLoading && (
          <Section>
            {stocks.map((stock, idx) =>
              editingCard && editingCard.index === idx ? (
                <NewCardInputForm key={idx}>
                  <NameInput
                    type='text'
                    placeholder='종목 이름 입력'
                    value={editingCard.name}
                    onChange={(e) =>
                      setEditingCard({ ...editingCard, name: e.target.value })
                    }
                    autoFocus
                  />
                  <SaveButton
                    onClick={handleSaveName}
                    disabled={!editingCard.name.trim()}>
                    저장
                  </SaveButton>
                </NewCardInputForm>
              ) : (
                <CardWrapper key={idx} onClick={() => handleCardClick(stock, idx)}>
                  <StatCard
                    title={stock.name || "이름 없음"}
                    value={
                      stock.price > 0 ? `₩${stock.price.toLocaleString()}` : "-"
                    }
                    change={stock.change}
                    icon={Activity}
                    color={stock.change > 0 ? "text-red-600" : "text-blue-600"}
                  />
                </CardWrapper>
              )
            )}

            {/* 빈 카드 (새 카드 추가) */}
            {!editingCard && (
              <EmptyCard onClick={handleAddCard}>
                <Plus size={40} />
              </EmptyCard>
            )}
          </Section>
        )}
        <HiddenInput
          type='file'
          accept='.xlsx,.xls'
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </Main>
    </Wrapper>
  );
}
