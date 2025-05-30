import type { Metadata } from 'next';
import Remote from '@/components/Remote';

export const metadata: Metadata = {
  title: 'Game Boy Printer Remote',
  robots: 'noindex,nofollow',
};

export default async function RemotePage() {
  return <Remote />;
}
