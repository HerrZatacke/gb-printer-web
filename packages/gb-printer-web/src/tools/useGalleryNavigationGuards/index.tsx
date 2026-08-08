import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useGalleryTreeAncestors } from '@/tools/useGalleryTreeAncestors';

export const useGalleryNavigationGuards = (): void => {
  const { path: currentPath, getUrl, paging, isWorking, currentPageIndex } = useGalleryTreeContext();
  const { navigateToGroup, isNavigating } = useNavigationTools();
  const router = useRouter();

  const targetSegments = useMemo(() => (currentPath.split('/').filter(Boolean)), [currentPath]);
  const ancestors = useGalleryTreeAncestors(targetSegments);

  const needsGroupRedirect = ancestors.length !== targetSegments.length + 1; // +1 for the root element

  // Guard 1: path segment is not a valid group -> walk up to deepest valid ancestor
  useEffect(() => {
    if (isWorking || isNavigating) {
      return;
    }

    if (needsGroupRedirect) {
      const deepestValidGroup = ancestors[ancestors.length - 1];
      navigateToGroup(deepestValidGroup.id, 0, true);
    }
  }, [ancestors, isNavigating, isWorking, navigateToGroup, needsGroupRedirect]);

  // Guard 2: page index for the current group is out of range -> redirect to corrected page
  useEffect(() => {
    if (isWorking || isNavigating || !paging || needsGroupRedirect) {
      return;
    }

    const validPageIndex = Math.min(Math.max(currentPageIndex, 0), paging.maxPageIndex);

    if (validPageIndex !== currentPageIndex) {
      router.replace(getUrl({ pageIndex: validPageIndex }));
    }

  }, [currentPageIndex, getUrl, isNavigating, isWorking, needsGroupRedirect, paging, router]);
};
