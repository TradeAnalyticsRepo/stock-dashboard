import { Activity } from 'lucide-react';
import React from 'react';
import styled from 'styled-components';

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

const Header = ({ chartType }: { chartType: 'rechart' | 'lightweight' }) => {
  return (
    <HeaderWrapper>
      <HeaderInner>
        <Left>
          <Activity style={{ color: '#dc2626', width: 32, height: 32 }} />
          <Title>하이하이</Title>
        </Left>
        <Nav>
          <NavLink href='/dashboard'>대시보드</NavLink>
          <NavLink href={chartType === 'rechart' ? '/lightweight' : '/rechart'}>차트 변경</NavLink>
          {/* <NavLink href="#">포트폴리오</NavLink> */}
          {/* <NavLink href="#">뉴스</NavLink> */}
          {/* <NavLink href="#">분석</NavLink> */}
        </Nav>
      </HeaderInner>
    </HeaderWrapper>
  );
};

export default Header;
