'use client';

import StockTable from '@/components/StockTable';
import { useSearchParams } from 'next/navigation';

export default function Lightweight() {
  const searchParams = useSearchParams();
  const stockName = searchParams.get('name');
  return <StockTable stockName={stockName} />;
}
