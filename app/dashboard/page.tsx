'use client';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Plus } from 'lucide-react';
import Header from '@/components/Header';
import StatCard from '@/components/ui/StatCard';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 예시 종목 데이터
  const stocks = [
    { name: '삼성전자', price: 10000, change: 0.54 },
    { name: 'LG화학', price: 20000, change: -0.12 },
    { name: 'NAVER', price: 15000, change: 1.23 },
    { name: '카카오', price: 12000, change: -0.45 },
  ];

  const handleCardClick = (stock: { name: string; price: number; change: number }) => {
    router.push(`/lightweight?name=${encodeURIComponent(stock.name)}`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 엑셀 업로드 처리 로직 (추후 구현)
  };

  return (
    <div className='min-h-screen bg-black text-white'>
      <Header chartType='rechart' />
      <main className='max-w-7xl mx-auto p-6'>
        {/* 주요 지표 섹션 */}
        <section className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          {stocks.map((stock, idx) => (
            <div
              key={idx}
              onClick={() => handleCardClick(stock)}
              className='cursor-pointer'>
              <StatCard
                title={stock.name}
                value={`₩${stock.price.toLocaleString()}`}
                change={stock.change}
                icon={Activity}
                color={stock.change > 0 ? 'text-red-600' : 'text-blue-600'}
              />
            </div>
          ))}
          {/* 빈 카드 (엑셀 업로드) */}
          <div
            onClick={handleUploadClick}
            className='flex items-center justify-center border-2 border-dashed rounded-lg cursor-pointer min-h-[120px]'>
            <Plus size={40} />
            <input
              type='file'
              accept='.xlsx,.xls'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
          </div>
        </section>
      </main>
    </div>
  );
}
