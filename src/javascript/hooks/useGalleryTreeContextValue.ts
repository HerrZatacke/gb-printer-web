import { useMemo } from 'react';
import unique from '../tools/unique';
import { createRoot } from '../app/contexts/galleryTree';
import { useGalleryParams } from './useGalleryParams';
import type { SerializableImageGroup, TreeImageGroup } from '../../types/ImageGroup';
import type { GalleryTreeContext, PathMap } from '../app/contexts/galleryTree';
import type { Image } from '../../types/Image';
import type { DialogOption } from '../../types/Dialog';
import useSettingsStore from '../app/stores/settingsStore';
import useInteractionsStore from '../app/stores/interactionsStore';
import useItemsStore from '../app/stores/itemsStore';

const MAX_INFLATE_DEPTH = 20;

const arrayDifference = (arrayA: string[], arrayB: string[]): string[] => (
  arrayA.filter((x) => !arrayB.includes(x))
);

interface SingleUsageResult {
  groups: SerializableImageGroup[],
  usedImageHashes: string[],
  usedGroupIDs: string[],
}

const ensureSingleUsage = (groups: SerializableImageGroup[]): SingleUsageResult => {
  let usedImageHashes: string[] = [];
  let usedGroupIDs: string[] = [];

  const check = (checkGroup: SerializableImageGroup): SerializableImageGroup => {
    // unique will remove duplicate images inside a single group
    // which could happen when json exports are manually edited
    const uniqueImages = unique(arrayDifference(checkGroup?.images, usedImageHashes));
    const uniqueGroups = unique(arrayDifference(checkGroup?.groups, usedGroupIDs));

    usedImageHashes = unique([...usedImageHashes, ...checkGroup.images]);
    usedGroupIDs = unique([...usedGroupIDs, ...checkGroup.groups]);

    return {
      ...checkGroup,
      images: uniqueImages,
      groups: uniqueGroups,
    };
  };

  return {
    groups: groups.map(check),
    usedImageHashes,
    usedGroupIDs,
  };
};

const reducePaths = (prefix: string, groups: TreeImageGroup[]): PathMap[] => (
  groups.reduce((acc: PathMap[], group: TreeImageGroup): PathMap[] => {
    const cleanSlug = group.slug.replace(/[^A-Z0-9_-]+/gi, '_');

    let count = 0;
    let absolute = `${prefix}${cleanSlug}/`;

    const pathExists = (test: string): boolean => (
      acc.findIndex(({ absolutePath }) => absolutePath === test) !== -1
    );

    while (pathExists(absolute)) {
      count += 1;
      absolute = `${prefix}${cleanSlug}_${count}/`;
    }

    return ([
      ...acc,
      {
        absolutePath: absolute,
        group,
      },
      ...reducePaths(absolute, group.groups),
    ]);
  }, [])
);

const reduceEmptyGroups = (acc: TreeImageGroup[], group: TreeImageGroup): TreeImageGroup[] => (
  group.groups.length + group.images.length ? [...acc, group] : acc
);

const reduceImages = (
  imageHashes: string[],
  childGroups: TreeImageGroup[],
) => (
  acc: Image[],
  image: Image,
): Image[] => {
  const foundImage = !!imageHashes.find((hash) => image.hash === hash);
  const foundCoverImage = !!childGroups.find(({ coverImage }) => image.hash === coverImage);
  return foundImage || foundCoverImage ? [...acc, image] : acc;
};

export const useGalleryTreeContextValue = (): GalleryTreeContext => {
  const { enableImageGroups } = useSettingsStore();
  const { setError } = useInteractionsStore();
  const { imageGroups: stateImageGroups, images: stateImages } = useItemsStore();

  const imageGroups = useMemo<SerializableImageGroup[]>(
    () => (enableImageGroups ? stateImageGroups : []),
    [enableImageGroups, stateImageGroups],
  );

  const { path } = useGalleryParams();

  // the .images property of any cleaned group will contain an image only once across all groups.
  // e.g.: if an image is a child of multiple groups, it will be removed from every group but one.
  // -> an image can only ever be member of a single group
  const singleUsageResult = useMemo<SingleUsageResult>((): SingleUsageResult => (
    ensureSingleUsage(imageGroups)
  ), [imageGroups]);

  const root = useMemo<TreeImageGroup>((): TreeImageGroup => {
    const inflateImageGroup = (depth: number) => (imageGroup: SerializableImageGroup): TreeImageGroup => {
      // return an array of all _found_ imagegroups and completely
      // omit groups if their ID is not found (possibly deleted)
      const getImageGroups = (acc: SerializableImageGroup[], groupId: string): SerializableImageGroup[] => {
        const found = singleUsageResult.groups.find(({ id }) => id === groupId);
        return found ? [...acc, found] : acc;
      };

      let childGroups: TreeImageGroup[];

      if (depth > MAX_INFLATE_DEPTH) {
        setError(new Error(`Reached maximum inflate depth at group "${imageGroup.title || imageGroup.slug}" (${imageGroup.id})`));
        childGroups = [];
      } else {
        try {
          childGroups = imageGroup.groups
            .reduce(getImageGroups, [])
            .map(inflateImageGroup(depth + 1))
            .reduce(reduceEmptyGroups, []);
        } catch (error) {
          childGroups = [];
        }
      }

      return ({
        id: imageGroup.id,
        slug: imageGroup.slug,
        created: imageGroup.created,
        title: imageGroup.title,
        coverImage: imageGroup.coverImage,
        groups: childGroups,
        images: stateImages.reduce(reduceImages(imageGroup.images, childGroups), []),
      });
    };

    const rootChildGroups = singleUsageResult.groups
      .map(inflateImageGroup(0)) // convert serializable to tree
      .reduce(reduceEmptyGroups, []) // remove groups without images_and_groups
      .filter(({ id }) => !singleUsageResult.usedGroupIDs.includes(id)); // remove groups which are children of other groups

    const rootImageHashes = stateImages.reduce((acc: string[], { hash }: Image): string[] => (
      !singleUsageResult.usedImageHashes.includes(hash) ? [...acc, hash] : acc
    ), []); // remove images which are children of other groups

    const newRoot = {
      ...createRoot(),
      groups: rootChildGroups,
      images: stateImages.reduce(reduceImages(rootImageHashes, rootChildGroups), []),
    };

    return newRoot;
  }, [singleUsageResult, stateImages, setError]);

  const paths = useMemo<PathMap[]>((): PathMap[] => (reducePaths('', root.groups)), [root]);

  const pathsOptions = useMemo<DialogOption[]>((): DialogOption[] => (
    paths.reduce((acc: DialogOption[], { group, absolutePath }): DialogOption[] => {
      const depth = absolutePath.split('/').length - 1;
      const indent = Array(depth).fill('\u2007').join('');

      return [
        ...acc,
        {
          value: absolutePath,
          name: `${indent}${group.title} (/${absolutePath.replace(/\/$/, '')})`,
        },
      ];
    }, [{
      value: '',
      name: '/',
    }])
  ), [paths]);

  const result = useMemo<GalleryTreeContext>((): GalleryTreeContext => {
    const view = paths.find(({ absolutePath }) => absolutePath === path)?.group || root;
    const covers = view.groups.map(({ coverImage }) => coverImage);
    const images = view.images.filter((image: Image) => !covers.includes(image.hash));

    return { view, covers, paths, images, pathsOptions };
  }, [path, paths, pathsOptions, root]);

  return result;
};
