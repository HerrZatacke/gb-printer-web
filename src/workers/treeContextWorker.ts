import { createTreeRoot } from '@/tools/createTreeRoot';
import { ensureSingleUsage, SingleUsageResult } from '@/tools/ensureSingleUsage';
import unique from '@/tools/unique';
import { type DialogOption } from '@/types/Dialog';
import {
  type CalculateRootWorkerParams,
  type CalculateRootWorkerResult,
  type CalculateRootWorkerError,
  type PathMap,
} from '@/types/galleryTreeContext';
import { type Image } from '@/types/Image';
import { type SerializableImageGroup, type TreeImageGroup } from '@/types/ImageGroup';

const MAX_INFLATE_DEPTH = 20;

const reduceImages = (
  imageHashes: string[],
  childGroups: TreeImageGroup[],
) => (
  acc: Image[],
  image: Image,
): Image[] => {
  const foundImage = !!imageHashes.find((hash) => image.hash === hash);
  const coverChildGroup = childGroups.find(({ coverImage }) => image.hash === coverImage);
  const foundCoverImage = !!coverChildGroup;
  const taggedImage = { ...image };

  // If image is a cover image, add all children's tags to it.
  // This is used for filtering within imageGroups
  if (coverChildGroup?.tags.length) {
    taggedImage.tags = unique([
      ...taggedImage.tags,
      ...coverChildGroup.tags,
    ]);
  }

  return foundImage || foundCoverImage ? [...acc, taggedImage] : acc;
};

const reducePaths = (prefix: string, groups: TreeImageGroup[]): PathMap[] => {
  const reducedPaths = groups.reduce((acc: PathMap[], group: TreeImageGroup): PathMap[] => {
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
  }, []);

  return reducedPaths;
};

const reduceEmptyGroups = (acc: TreeImageGroup[], group: TreeImageGroup): TreeImageGroup[] => (
  group.groups.length + group.images.length ? [...acc, group] : acc
);

const inflateImageGroup = (depth: number, stateImages: Image[], singleUsageResult: SingleUsageResult) => (imageGroup: SerializableImageGroup): TreeImageGroup => {
  // return an array of all _found_ imagegroups and completely
  // omit groups if their ID is not found (possibly deleted)
  const getImageGroups = (acc: SerializableImageGroup[], groupId: string): SerializableImageGroup[] => {
    const found = singleUsageResult.groups.find(({ id }) => id === groupId);
    return found ? [...acc, found] : acc;
  };

  let childGroups: TreeImageGroup[];

  if (depth > MAX_INFLATE_DEPTH) {
    const error: CalculateRootWorkerError = {
      type: 'error',
      error: `Reached maximum inflate depth at group "${imageGroup.title || imageGroup.slug}" (${imageGroup.id})`,
    };
    self.postMessage(error);
    childGroups = [];
  } else {
    try {
      childGroups = imageGroup.groups
        .reduce(getImageGroups, [])
        .map(inflateImageGroup(depth + 1, stateImages, singleUsageResult))
        .reduce(reduceEmptyGroups, []);
    } catch {
      childGroups = [];
    }
  }

  const images: Image[] = stateImages.reduce(reduceImages(imageGroup.images, childGroups), []);

  const foundCoverImage: Image | undefined = images.find(({ hash }) => hash === imageGroup.coverImage) || images[0];

  const coverImage = foundCoverImage?.hash || imageGroup.coverImage;

  const tags = unique(images.map((image) => image.tags).flat(1));

  return ({
    id: imageGroup.id,
    slug: imageGroup.slug,
    created: imageGroup.created,
    title: imageGroup.title,
    coverImage,
    groups: childGroups,
    images,
    tags,
  });
};

self.onmessage = (messageEvent: MessageEvent<CalculateRootWorkerParams>) => {
  const startTime = Date.now();
  const { imageGroups, stateImages } = messageEvent.data;

  // the .images property of any cleaned group will contain an image only once across all groups.
  // e.g.: if an image is a child of multiple groups, it will be removed from every group but one.
  // -> an image can only ever be member of a single group
  const singleUsageResult = ensureSingleUsage(imageGroups);

  const rootChildGroups = singleUsageResult.groups
    .map(inflateImageGroup(0, stateImages, singleUsageResult)) // convert serializable to tree
    .reduce(reduceEmptyGroups, []) // remove groups without images_and_groups
    .filter(({ id }) => !singleUsageResult.usedGroupIDs.includes(id)); // remove groups which are children of other groups

  const rootImageHashes = stateImages.reduce((acc: string[], { hash }: Image): string[] => (
    !singleUsageResult.usedImageHashes.includes(hash) ? [...acc, hash] : acc
  ), []); // remove images which are children of other groups

  const root = {
    ...createTreeRoot(),
    groups: rootChildGroups,
    images: stateImages.reduce(reduceImages(rootImageHashes, rootChildGroups), []),
  };

  const paths = reducePaths('', root.groups);

  const pathsOptions = paths.reduce((acc: DialogOption[], { group, absolutePath }): DialogOption[] => {
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
    }]);

  const result: CalculateRootWorkerResult = {
    type: 'result',
    root,
    paths,
    pathsOptions,
    duration: Date.now() - startTime,
  };
  self.postMessage(result);
};
