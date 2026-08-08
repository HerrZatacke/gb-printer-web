import { useMemo } from 'react';
import { useImageGroups } from '@/hooks/useImageGroups';
import { type TreeImageGroup } from '@/types/ImageGroup';

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


export const useGalleryTreeAncestors = (targetSegments: string[]): TreeImageGroup[] => {
  const { imageGroupTree } = useImageGroups({ tree: true });

  const ancestors = useMemo(() => {
    if (!imageGroupTree) {
      return [];
    }

    return collectAncestors(imageGroupTree, targetSegments);
  }, [imageGroupTree, targetSegments]);

  return ancestors;
};
