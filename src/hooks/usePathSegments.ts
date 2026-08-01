import { useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useGalleryTreeAncestors } from '@/tools/useGalleryTreeAncestors';
import { type TreeImageGroup } from '@/types/ImageGroup';

export interface Segment {
  group: TreeImageGroup;
  link: string;
}

export interface UsePathSegments {
  segments: Segment[];
}

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath, getUrl, isWorking } = useGalleryTreeContext();
  const { getImagePageIndexInGroup } = useNavigationTools();

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
            // ToDo: find way to calulate group position for groups without coverimage (using viewItems)?
            const childCoverImage = childGroup.coverImage;
            parentPageIndex = childCoverImage ? await getImagePageIndexInGroup(childCoverImage, group) : 0;
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
  }, [ancestors, getImagePageIndexInGroup, getUrl, isWorking]);

  return {
    segments,
  };
};
