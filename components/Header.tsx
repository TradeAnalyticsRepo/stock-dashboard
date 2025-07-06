import { Activity } from "lucide-react";
import React from "react";

const Header = ({ chartType }: { chartType: "rechart" | "lightweight" }) => {
  return (
    <header className='bg-gray-900 border-b border-gray-800 px-6 py-4'>
      <div className='max-w-7xl mx-auto flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <Activity className='text-red-600 w-8 h-8' />
          <h1 className='text-2xl font-bold'>하이하이</h1>
        </div>
        <nav className='flex space-x-6'>
          <a
            href='#'
            className='text-gray-300 hover:text-white transition-colors'>
            대시보드
          </a>
          <a
            href={chartType === "rechart" ? "/lightweight" : "/rechart"}
            className='text-gray-300 hover:text-white transition-colors'>
            차트 변경
          </a>
          {/* <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              포트폴리오
            </a> */}
          {/* <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              뉴스
            </a>
            <a
              href='#'
              className='text-gray-300 hover:text-white transition-colors'>
              분석
            </a> */}
        </nav>
      </div>
    </header>
  );
};

export default Header;
