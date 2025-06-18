import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGalleryTreeContext } from '@/contexts/galleryTree';
import { useGalleryParams } from '@/hooks/useGalleryParams';
import useFiltersStore from '@/stores/filtersStore';
import useSettingsStore from '@/stores/settingsStore';
import { ROOT_ID } from '@/tools/createTreeRoot';
import { getFilteredImages } from '@/tools/getFilteredImages';
import { type Image } from '@/types/Image';
import { type TreeImageGroup } from '@/types/ImageGroup';

export interface UseNavigationTools {
  getGroupPath: (groupId: string, pageIndex: number) => string,
  currentGroup: TreeImageGroup,
  getImagePageIndexInGroup: (imageHash: string, parentGroup: TreeImageGroup) => number,
  navigateToGroup: (groupId: string, pageIndex: number) => void,
  navigateToImage: (hash: string) => void,
}

interface ShouldNavigate {
  imageHash? :string,
  group?: {
    id: string,
    pageIndex: number,
  },
}

export const useNavigationTools = (): UseNavigationTools => {
  const router = useRouter();
  const { paths, root, isWorking } = useGalleryTreeContext();
  const [shouldNavigate, setShouldNavigate] = useState<ShouldNavigate | false>(false);
  const { sortBy, filtersActiveTags, recentImports } = useFiltersStore();
  const { pageSize } = useSettingsStore();
  const { path: currentPath, getUrl } = useGalleryParams();

  const imageFilter = useCallback((images: Image[]): Image[] => (
    getFilteredImages(images, {
      filtersActiveTags,
      sortBy,
      recentImports,
    })
  ), [filtersActiveTags, recentImports, sortBy]);

  const getImagePageIndexInGroup = useCallback((imageHash: string, parentGroup: TreeImageGroup) => {
    const sortedImages = imageFilter(parentGroup.images);
    const imageIndex = sortedImages.findIndex(({ hash }) => (
      hash === imageHash
    ));

    return Math.floor(imageIndex / pageSize);
  }, [imageFilter, pageSize]);

  const getGroupPath = useCallback((groupId: string, pageIndex: number): string => {
    if (groupId === ROOT_ID) {
      return getUrl({ pageIndex, group: '' });
    }

    const groupPath = paths.find(({ group: { id } }) => (groupId === id))?.absolutePath || '';
    return getUrl({ pageIndex, group: groupPath });
  }, [getUrl, paths]);

  const currentGroup = useMemo<TreeImageGroup>(() => (
    paths.find(({ absolutePath }) => (absolutePath === currentPath))?.group || root
  ), [currentPath, paths, root]);

  const getPagedImagePath = useCallback((imageHash: string): string => {
    const pathMap = paths.find(({ group: { images } }) => (
      images.map(({ hash }) => hash).includes(imageHash)
    ));

    const viewSlug = pathMap?.absolutePath || '';
    const group = pathMap?.group || root;

    const pageIndex = getImagePageIndexInGroup(imageHash, group);

    return getUrl({ pageIndex, group: viewSlug });
  }, [getImagePageIndexInGroup, getUrl, paths, root]);

  const navigateToGroup = useCallback((groupId: string, pageIndex: number) => {
    if (isWorking) { return; }

    // use a timeout so that treeContext (and worker) can become "working" before triggering navigation
    window.setTimeout(() => {
      setShouldNavigate({
        group: {
          id: groupId,
          pageIndex,
        },
      });
    }, 1);
  }, [isWorking]);

  const navigateToImage = useCallback((hash: string) => {
    // use a timeout so that treeContext (and worker) can become "working" before triggering navigation
    window.setTimeout(() => {
      setShouldNavigate({ imageHash: hash });
    }, 1);
  }, []);

  useEffect(() => {
    if (isWorking || !shouldNavigate) { return; }

    const handle = window.setTimeout(() => {
      if (shouldNavigate.imageHash) {
        router.push(getPagedImagePath(shouldNavigate.imageHash));
        setShouldNavigate(false);
      } else if (shouldNavigate.group) {
        router.push(getGroupPath(shouldNavigate.group.id, shouldNavigate.group.pageIndex));
        setShouldNavigate(false);
      }
    }, 1);

    return () => { window.clearTimeout(handle); };
  }, [getGroupPath, getPagedImagePath, isWorking, router, shouldNavigate]);

  return {
    currentGroup,
    getGroupPath,
    getImagePageIndexInGroup,
    navigateToGroup,
    navigateToImage,
  };
};
