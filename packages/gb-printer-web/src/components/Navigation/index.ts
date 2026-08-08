import dynamic from 'next/dynamic';
import NavigationSkeleton from '@/components/Navigation/Skeleton';

export const Navigation = dynamic(() => import('@/components/Navigation/ClientNavigation'), {
  ssr: false,
  loading: NavigationSkeleton,
});
