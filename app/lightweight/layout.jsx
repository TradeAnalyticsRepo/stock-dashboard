import { Suspense } from 'react';

export default function LightweightLayout({ children }) {
  return <Suspense>{children}</Suspense>;
}
