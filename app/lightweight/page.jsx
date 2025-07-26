"use client";

import StockDashboard2 from "../../components/StockDashboard2_lightweight";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { callGetApi } from "../utils/api.js";
import styled from "styled-components";

const Wrapper = styled.div`
  min-height: 100vh;
  background: #000;
  color: #fff;
`;

const FlexCenter = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Lightweight() {
  const searchParams = useSearchParams();
  const stockName = searchParams.get("name");
  const [allData, setAllData] = useState([]);
  const [lastestData, setLastestData] = useState([]);
  useEffect(() => {
    const getFile = async () => {
      const response = await callGetApi("/api/excel", { stockId: stockName, type: "graph" });
      const lastestResponse = await callGetApi("/api/excel", { stockId: stockName, type: "lastest" });

      setAllData(response?.data || []);
      setLastestData(lastestResponse?.data || []);
    };

    getFile();
  }, []);

  return allData.length === 0 ? (
    <Wrapper>
      <FlexCenter>로딩 중...</FlexCenter>
    </Wrapper>
  ) : (
    <StockDashboard2
      stockName={stockName}
      allData={allData}
      lastestData={lastestData}
    />
  );
}
