'use client';

import PeriodStockTable from '../../components/PeriodStockTable';
import { useSearchParams } from 'next/navigation';

export default function PeriodTable() {
  const searchParams = useSearchParams();
  const stockName = searchParams.get('name');
  const from = searchParams.get('from');
  const to = searchParams.get('to');
  return <PeriodStockTable stockName={stockName} from={from} to={to} />;
}
