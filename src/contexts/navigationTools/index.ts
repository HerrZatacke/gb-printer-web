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

interface UseNavigationTools {
  getGroupPath: (groupId: string) => string,
  currentGroup: TreeImageGroup,
  getImagePageIndexInGroup: (imageHash: string, parentGroup: TreeImageGroup) => number,
  getPagedImagePath: (hash: string) => string,
  navigateToGroup: (groupId: string) => void,
  navigateToImage: (hash: string) => void,
}

interface ShouldNavigate {
  imageHash? :string,
  groupId?: string,
  page?: {
    slug: string,
    viewId: string,
  },
}

export const useNavigationTools = (): UseNavigationTools => {
  const router = useRouter();
  const { paths, root } = useGalleryTreeContext();
  const [shouldNavigate, setShouldNavigate] = useState<ShouldNavigate>({});
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

  const getGroupPath = useCallback((groupId: string): string => {
    if (groupId === ROOT_ID) {
      return getUrl({ pageIndex: 0, group: '' });
    }

    const groupPath = paths.find(({ group: { id } }) => (groupId === id))?.absolutePath || '';
    return getUrl({ pageIndex: 0, group: groupPath });
  }, [getUrl, paths]);

  const currentGroup = useMemo<TreeImageGroup>(() => (
    paths.find(({ absolutePath }) => (absolutePath === currentPath))?.group || root
  ), [currentPath, paths, root]);

  const navigateToGroup = (groupId: string) => {
    setShouldNavigate({ groupId });
  };

  const getPagedImagePath = useCallback((imageHash: string): string => {
    const pathMap = paths.find(({ group: { images } }) => (
      images.map(({ hash }) => hash).includes(imageHash)
    ));

    const viewSlug = pathMap?.absolutePath || '';
    const group = pathMap?.group || root;

    const pageIndex = getImagePageIndexInGroup(imageHash, group);

    return getUrl({ pageIndex, group: viewSlug });
  }, [getImagePageIndexInGroup, getUrl, paths, root]);

  const navigateToImage = (hash: string) => {
    setShouldNavigate({ imageHash: hash });
  };

  useEffect(() => {
    if (shouldNavigate.imageHash) {
      router.push(getPagedImagePath(shouldNavigate.imageHash));
      setShouldNavigate({});
    } else if (shouldNavigate.groupId) {
      router.push(getGroupPath(shouldNavigate.groupId));
      setShouldNavigate({});
    }
  }, [getGroupPath, getPagedImagePath, router, shouldNavigate]);

  return {
    currentGroup,
    getGroupPath,
    getPagedImagePath,
    getImagePageIndexInGroup,
    navigateToGroup,
    navigateToImage,
  };
};
