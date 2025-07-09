'use client';

import StockDashboard2 from '@/components/StockDashboard2_lightweight';
import { useSearchParams } from 'next/navigation';

export default function Lightweight() {
  const searchParams = useSearchParams();
  const stockName = searchParams.get('name');
  return <StockDashboard2 stockName={stockName} />;
}
