import { useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { type TreeImageGroup } from '@/types/ImageGroup';

export interface Segment {
  group: TreeImageGroup;
  link: string;
}

export interface UsePathSegments {
  segments: Segment[];
}

const collectAncestors = (
  root: TreeImageGroup,
  remainingSegments: string[],
): TreeImageGroup[] => {
  if (remainingSegments.length === 0) {
    return [root];
  }

  const [nextSegment, ...rest] = remainingSegments;
  const nextChild = root.groups.find((child) => child.fullSlug.split('/').pop() === nextSegment);
  if (!nextChild) {
    return [root];
  }

  return [root, ...collectAncestors(nextChild, rest)];
};

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath, getUrl } = useGalleryTreeContext();
  const { getImagePageIndexInGroup, navigateToGroup } = useNavigationTools();
  const { imageGroupTree } = useImageGroups({ tree: true });

  const [segments, setSegments] = useState<Segment[]>([]);

  const targetSegments = useMemo(() => (currentPath.split('/').filter(Boolean)), [currentPath]);

  const ancestors = useMemo(() => {
    if (!imageGroupTree) {
      return [];
    }

    return collectAncestors(imageGroupTree, targetSegments);
  }, [imageGroupTree, targetSegments]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      if (!ancestors.length) {
        setSegments([]);
        return;
      }

      const breadCrumbSegments = await Promise.all(
          ancestors.map(async (group: TreeImageGroup, index: number): Promise<Segment> => {
          const childGroup: TreeImageGroup | undefined = ancestors[index + 1];

          let parentPageIndex = 0;

          if (childGroup) {
            const childCoverImage = childGroup.coverImage;
            parentPageIndex = await getImagePageIndexInGroup(childCoverImage, group);
          }

          return {
            group,
            link: getUrl({ pageIndex: parentPageIndex, group: group.fullSlug }),
          };
        }),
      );

      if (!cancelled) {
        setSegments(breadCrumbSegments);
      }
    }, 1);

    return () => {
      cancelled = true;
      window.clearTimeout(handle);
    };
  }, [ancestors, getImagePageIndexInGroup, getUrl]);

  // ToDo: Navigation Effects / There should be a centralized spot for all redirects
  useEffect(() => {
    const isFullMatch = ancestors.length === targetSegments.length + 1; // +1 for the root element
    if (imageGroupTree && !isFullMatch) {
      const deepestValidGroup = ancestors[ancestors.length - 1];
      navigateToGroup(deepestValidGroup.id, 0);
    }
  }, [imageGroupTree, ancestors, navigateToGroup, targetSegments.length]);

  return {
    segments,
  };
};
