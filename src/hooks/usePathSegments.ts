import { useEffect, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/GalleryTreeContext';
import { useNavigationTools } from '@/contexts/NavigationToolsContext';
import { useImageGroups } from '@/hooks/useImageGroups';
import { type NewTreeImageGroup } from '@/types/ImageGroup';

export interface Segment {
  group: NewTreeImageGroup;
  link: string;
}

export interface UsePathSegments {
  segments: Segment[];
}

// ToDo: handle "partial" paths
const collectAncestors = (
  root: NewTreeImageGroup,
  targetFullSlug: string,
): NewTreeImageGroup[] => {
  if (root.fullSlug === targetFullSlug) {
    return [root];
  }

  for (const child of root.groups) {
    const remaining = collectAncestors(child, targetFullSlug);
    if (remaining.length > 0) {
      return [root, ...remaining];
    }
  }

  return [];
};

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath, getUrl } = useGalleryTreeContext();
  const { getImagePageIndexInGroup /*, navigateToGroup */ } = useNavigationTools();
  const { imageGroupTree } = useImageGroups({ tree: true });

  const [segments, setSegments] = useState<Segment[]>([]);

  useEffect(() => {
    let cancelled = false;
    const handle = window.setTimeout(async () => {
      if (!imageGroupTree) {
        setSegments([]);
        return;
      }

      const breadcrumbPaths = collectAncestors(imageGroupTree, currentPath);

      const breadCrumbSegments = await Promise.all(
          breadcrumbPaths.map(async (group: NewTreeImageGroup, index: number): Promise<Segment> => {
          const childGroup: NewTreeImageGroup | undefined = breadcrumbPaths[index + 1];

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
  }, [currentPath, getImagePageIndexInGroup, getUrl, imageGroupTree]);

  useEffect(() => {
    console.log({
      currentPath,
      currentPathSplit: currentPath.split('/'),
      segments: segments.map(({ group }) => group.fullSlug),
    });
  }, [currentPath, segments]);

  // ToDo: Navigation Effects
  // useEffect(() => {
  //   // if url path does not match breadcrumb, navigate to the best possible path instead
  //   if (breadCrumbSlugs.length !== segments.length) {
  //     const validGroupId = segments[segments.length - 1].group.id;
  //     navigateToGroup(validGroupId, 0);
  //   }
  // }, [breadCrumbSlugs.length, isInitialized, navigateToGroup, segments]);

  return {
    segments,
  };
};
