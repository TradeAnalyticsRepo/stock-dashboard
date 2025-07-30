import { Suspense } from 'react';

export default function TableLayout({ children }) {
  return <Suspense>{children}</Suspense>;
}
