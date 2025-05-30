import { Suspense } from 'react';
import CopyDatabase from '@/components/CopyDatabase';

export default function DatabasePage() {
  return (
    <Suspense>
      <CopyDatabase />
    </Suspense>
  );
}
