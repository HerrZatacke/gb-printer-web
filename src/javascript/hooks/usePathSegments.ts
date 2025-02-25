import { useMemo } from 'react';
import { useGalleryParams } from './useGalleryParams';
import { useGalleryTreeContext } from '../app/contexts/galleryTree';
import useFiltersStore from '../app/stores/filtersStore';
import useSettingsStore from '../app/stores/settingsStore';
import type { TreeImageGroup } from '../../types/ImageGroup';
import { getFilteredImages } from '../tools/getFilteredImages';

export interface Segment {
  group: TreeImageGroup,
  basePath: string, // Path without page number, for concatenation
  pagedPath: string,
}

export interface UsePathSegments {
  segments: Segment[],
}

export const usePathSegments = (): UsePathSegments => {
  const { path: currentPath } = useGalleryParams();
  const { root, paths } = useGalleryTreeContext();
  const { pageSize } = useSettingsStore();
  const {
    sortBy,
    filtersActiveTags,
    recentImports,
  } = useFiltersStore();

  const segments = useMemo<Segment[]>(() => (
    `/${currentPath}` // adding a "/" in front, so "index" in reduce-loop will start with 1
      .split('/')
      .reduce((acc: Segment[], segment: string, index: number): Segment[] => {
        if (!segment) {
          return index === 0 ? [{
            group: root,
            pagedPath: 'page/1',
            basePath: '',
          }] : acc;
        }

        const parentSegment = acc[index - 1] || null;


        const basePath = (
          parentSegment ?
            [parentSegment.basePath, segment].join('') :
            segment
        ).concat('/');

        const group = paths.find(({ absolutePath }) => absolutePath === basePath)?.group || null;

        if (!group) {
          return acc;
        }

        if (parentSegment) {
          // Sort images first to get to the correct image/page index
          const sortedImages = getFilteredImages(parentSegment.group.images, {
            filtersActiveTags,
            sortBy,
            recentImports,
          });

          const coverImageIndex = sortedImages.findIndex(({ hash }) => (
            hash === group.coverImage
          ));

          const parentPageIndex = Math.floor(coverImageIndex / pageSize) + 1;

          parentSegment.pagedPath = `${parentSegment.basePath}page/${parentPageIndex}`;
        }

        return [
          ...acc,
          {
            group,
            pagedPath: `${basePath}page/1`,
            basePath,
          },
        ];
      }, [])
  ), [currentPath, filtersActiveTags, pageSize, paths, recentImports, root, sortBy]);

  return {
    segments,
  };
};
