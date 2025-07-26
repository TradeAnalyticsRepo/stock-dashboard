"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Plus, Loader2, MoreVertical, Trash2, Upload } from "lucide-react";
import styled, { keyframes } from "styled-components";
import Header from "../../components/Header";
import StatCard from "../../components/ui/StatCard";
import { Activity } from "lucide-react";
import { processingExcelData } from "../utils/excelUtils";
import { callGetApi, callDeleteApi } from "../../app/utils/api.js";

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
  position: relative;
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

const CardMenu = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #2a2a2a;
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 120px;
`;

const DropdownMenuItem = styled.button`
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  padding: 0.5rem;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 0.25rem;
  &:hover {
    background-color: #3a3a3a;
  }
`;

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [stocks, setStocks] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [selectedStockIndex, setSelectedStockIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const fetchStockFiles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await callGetApi("/api/getExcelFiles", {});
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

  const handleCardClick = (stock, index, isMenuClick = false) => {
    if (isMenuClick) return;
    if (stock.price === 0 && stock.name) {
      setSelectedStockIndex(index);
      fileInputRef.current?.click();
    } else if (stock.name) {
      router.push(`/lightweight?name=${encodeURIComponent(stock.name)}`);
    }
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

  const handleFileChange = async (e) => {
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
      await fetchStockFiles();
    } catch (error) {
      console.error("Error processing excel file:", error);
      setError("엑셀 파일 처리 중 오류가 발생했습니다. 파일 형식을 확인해주세요.");
    } finally {
      setSelectedStockIndex(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsLoading(false);
    }
  };

  const handleDeleteStock = async (stockName) => {
    if (!confirm(`'${stockName}' 종목을 삭제하시겠습니까?`)) return;

    try {
      setIsLoading(true);
      setError(null);
      await callDeleteApi(`/api/excel?stockId=${stockName}`);
      await fetchStockFiles();
    } catch (error) {
      console.error("Error deleting stock:", error);
      setError("종목 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setMenuOpen(null);
    }
  };

  const handleUpdateStock = (index) => {
    setSelectedStockIndex(index);
    fileInputRef.current?.click();
    setMenuOpen(null);
  };

  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index);
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
                    onChange={(e) => setEditingCard({ ...editingCard, name: e.target.value })}
                    autoFocus
                  />
                  <SaveButton
                    onClick={handleSaveName}
                    disabled={!editingCard.name.trim()}>
                    저장
                  </SaveButton>
                </NewCardInputForm>
              ) : (
                <CardWrapper
                  key={idx}
                  onClick={() => handleCardClick(stock, idx)}>
                  {stock.name && (
                    <CardMenu onClick={(e) => e.stopPropagation()}>
                      <MenuButton onClick={() => toggleMenu(idx)}>
                        <MoreVertical size={20} />
                      </MenuButton>
                      {menuOpen === idx && (
                        <DropdownMenu>
                          <DropdownMenuItem onClick={() => handleUpdateStock(idx)}>
                            <Upload size={16} />
                            업데이트
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteStock(stock.name)}>
                            <Trash2 size={16} />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenu>
                      )}
                    </CardMenu>
                  )}
                  <StatCard
                    title={stock.name || "이름 없음"}
                    value={stock.price > 0 ? `₩${stock.price.toLocaleString()}` : "-"}
                    change={stock.change}
                    icon={Activity}
                    color={stock.change > 0 ? "text-red-600" : "text-blue-600"}
                  />
                </CardWrapper>
              )
            )}

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
