import { useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useNavigationToolsContext } from '@/contexts/navigationTools/NavigationToolsProvider';
import { useGalleryParams } from '@/hooks/useGalleryParams';
import { PathMap } from '@/types/galleryTreeContext';
import type { TreeImageGroup } from '@/types/ImageGroup';

export interface Segment {
  group: TreeImageGroup,
  link: string,
}

export interface UsePathSegments {
  segments: Segment[],
}

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath, getUrl } = useGalleryParams();
  const { root, paths } = useGalleryTreeContext();
  const { getImagePageIndexInGroup, navigateToGroup } = useNavigationToolsContext();

  const segments = useMemo<Segment[]>(() => {
    const breadCrumbsRaw = ['', ...currentPath.split('/').filter(Boolean)];

    const breadCrumbSlugs = breadCrumbsRaw.reduce((acc: string[], path: string, index: number): string[] => ([
      ...acc,
      breadCrumbsRaw.slice(1, index + 1).join('/').concat('/'),
    ]), []);

    const breadCrumbPaths: PathMap[] = breadCrumbSlugs.reduce((acc: PathMap[], breadCrumbPath): PathMap[] => {
      let segmentPath: PathMap | undefined;

      if (breadCrumbPath === '/') {
        segmentPath = { absolutePath: '', group: root };
      } else {
        segmentPath = paths.find(({ absolutePath }) => absolutePath === breadCrumbPath);
      }

      return segmentPath ? [...acc, segmentPath] : acc;
    }, []);

    const breadCrumbSegments = breadCrumbPaths.map((breadCrumbPath: PathMap, index: number): Segment => {
      const childPath = breadCrumbPaths[index + 1];

      let parentPageIndex = 0;

      if (childPath) {
        const childCoverImage = childPath.group.coverImage;
        parentPageIndex = getImagePageIndexInGroup(childCoverImage, breadCrumbPath.group);
      }

      return {
        group: breadCrumbPath.group,
        link: getUrl({ pageIndex: parentPageIndex, group: breadCrumbPath.absolutePath }),
      };
    });

    // if url path does not match breadcrumb, navigater to the best possible path instead
    if (breadCrumbSlugs.length !== breadCrumbSegments.length) {
      const validGroupId = breadCrumbSegments[breadCrumbSegments.length - 1].group.id;
      navigateToGroup(validGroupId, 0);
    }

    return breadCrumbSegments;
  }, [currentPath, root, paths, getUrl, getImagePageIndexInGroup, navigateToGroup]);

  return {
    segments,
  };
};
