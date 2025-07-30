import { Suspense } from 'react';

export default function DashboardLayout({ children }) {
  return <Suspense>{children}</Suspense>;
}
