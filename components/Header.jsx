import { Activity } from "lucide-react";
import React from "react";
import styled from "styled-components";

const HeaderWrapper = styled.header`
  background: #1a1a1a;
  border-bottom: 1px solid #27272a;
  padding: 1rem 1.5rem;
`;
const HeaderInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;
const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
`;
const StockNameSpan = styled.span`
  margin-left: 1rem;
  font-size: 1.25rem;
  color: #38bdf8;
  font-weight: 600;
  background: linear-gradient(90deg, rgba(56, 189, 248, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%);
  border-radius: 0.5rem;
  padding: 0.25rem 0.75rem;
  vertical-align: middle;
  box-shadow: 0 2px 8px 0 rgba(56, 189, 248, 0.08);
  letter-spacing: 0.02em;
`;
const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;
const NavLink = styled.a`
  color: #d1d5db;
  transition: color 0.2s;
  text-decoration: none;
  &:hover {
    color: #fff;
  }
`;

// stockName prop 추가
const Header = ({ chartType, stockName }) => {
  return (
    <HeaderWrapper>
      <HeaderInner>
        <NavLink href='/dashboard'>
          <Left>
            <Activity style={{ color: "#dc2626", width: 32, height: 32 }} />
            <Title>
              HOME
              {stockName && <StockNameSpan>{stockName}</StockNameSpan>}
            </Title>
          </Left>
        </NavLink>
        <Nav>{chartType !== "table" && <NavLink href={`/table?name=${stockName}`}>수급분석표</NavLink>}</Nav>
      </HeaderInner>
    </HeaderWrapper>
  );
};

export default Header;
