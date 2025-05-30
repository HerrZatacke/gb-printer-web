import { useMemo } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useNavigationTools } from '@/contexts/navigationTools';
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
  const { getImagePageIndexInGroup } = useNavigationTools();

  const segments = useMemo<Segment[]>(() => {
    const breadCrumbsRaw = ['', ...currentPath.split('/').filter(Boolean)];

    const breadCrumbSlugs = breadCrumbsRaw.reduce((acc: string[], path: string, index: number): string[] => ([
      ...acc,
      breadCrumbsRaw.slice(1, index + 1).join('/').concat('/'),
    ]), []);

    const breadCrumbPaths: PathMap[] = breadCrumbSlugs.map((breadCrumbPath): PathMap => (
      paths.find(({ absolutePath }) => absolutePath === breadCrumbPath) || {
        absolutePath: '',
        group: root,
      }
    ));

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

    return breadCrumbSegments;
  }, [currentPath, getImagePageIndexInGroup, getUrl, paths, root]);

  return {
    segments,
  };
};
