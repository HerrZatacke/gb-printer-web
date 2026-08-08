import { type TreeImageGroup } from 'gb-printer-schemas';
import { useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useGalleryTreeAncestors } from '@/tools/useGalleryTreeAncestors';

export interface Segment {
  group: TreeImageGroup;
  link: string;
}

export interface UsePathSegments {
  segments: Segment[];
}

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath, getUrl, isWorking } = useGalleryTreeContext();
  const { getItemPageIndexInGroup } = useNavigationTools();

  const [segments, setSegments] = useState<Segment[]>([]);

  const targetSegments = useMemo(() => (currentPath.split('/').filter(Boolean)), [currentPath]);

  const ancestors = useGalleryTreeAncestors(targetSegments);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      if (!ancestors.length || isWorking) {
        setSegments([]);
        return;
      }

      const breadCrumbSegments = await Promise.all(
          ancestors.map(async (group: TreeImageGroup, index: number): Promise<Segment> => {
          const childGroup: TreeImageGroup | undefined = ancestors[index + 1];

          let parentPageIndex = 0;

          if (childGroup) {
            parentPageIndex = await getItemPageIndexInGroup(childGroup.id, group);
          }

          return {
            group,
            link: getUrl({ pageIndex: parentPageIndex, group: group.fullSlug }),
          };
        }),
      );

      if (!cancelled && !isWorking) {
        setSegments(breadCrumbSegments);
      }
    }, 1);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [ancestors, getItemPageIndexInGroup, getUrl, isWorking]);

  return {
    segments,
  };
};
