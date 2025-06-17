import { expose } from 'comlink';
import { createTreeRoot } from '@/tools/createTreeRoot';
import { ensureSingleUsage, SingleUsageResult } from '@/tools/ensureSingleUsage';
import unique from '@/tools/unique';
import { type DialogOption } from '@/types/Dialog';
import {
  type CalculateRootWorkerParams,
  type CalculateRootWorkerResult,
  type PathMap,
  type TreeContextWorkerApi,
} from '@/types/galleryTreeContext';
import { type Image } from '@/types/Image';
import { type SerializableImageGroup, type TreeImageGroup } from '@/types/ImageGroup';

const MAX_INFLATE_DEPTH = 20;

const filterAndTagImages = (
  imageHashes: string[],
  childGroups: TreeImageGroup[],
  stateImageMap: Map<string, Image>,
): Image[] => {
  const imageHashSet = new Set(imageHashes);
  const coverImageSet = new Set(childGroups.map(({ coverImage }) => coverImage));

  return [...imageHashSet, ...coverImageSet].map((hash) => {
    const image = stateImageMap.get(hash);
    if (!image) return null;

    const taggedImage = { ...image };
    const coverChildGroup = childGroups.find(({ coverImage }) => coverImage === hash);

    if (coverChildGroup?.tags.length) {
      taggedImage.tags = unique([
        ...taggedImage.tags,
        ...coverChildGroup.tags,
      ]);
    }

    return taggedImage;
  }).filter(Boolean) as Image[];
};

const reducePaths = (prefix: string, groups: TreeImageGroup[], usedPaths: Set<string>): PathMap[] => {
  const reducedPaths = groups.reduce((acc: PathMap[], group: TreeImageGroup): PathMap[] => {
    const cleanSlug = group.slug.replace(/[^A-Z0-9_-]+/gi, '_');

    let count = 0;
    let absolute = `${prefix}${cleanSlug}/`;

    while (usedPaths.has(absolute)) {
      count += 1;
      absolute = `${prefix}${cleanSlug}_${count}/`;
    }

    usedPaths.add(absolute);

    return ([
      ...acc,
      {
        absolutePath: absolute,
        group,
      },
      ...reducePaths(absolute, group.groups, usedPaths),
    ]);
  }, []);

  return reducedPaths;
};

const reduceEmptyGroups = (acc: TreeImageGroup[], group: TreeImageGroup): TreeImageGroup[] => (
  group.groups.length + group.images.length ? [...acc, group] : acc
);

const inflateImageGroup = (depth: number, stateImageMap: Map<string, Image>, singleUsageResult: SingleUsageResult) => (imageGroup: SerializableImageGroup): TreeImageGroup => {
  // return an array of all _found_ imagegroups and completely
  // omit groups if their ID is not found (possibly deleted)
  const getImageGroups = (acc: SerializableImageGroup[], groupId: string): SerializableImageGroup[] => {
    const found = singleUsageResult.groups.find(({ id }) => id === groupId);
    return found ? [...acc, found] : acc;
  };

  let childGroups: TreeImageGroup[];

  if (depth > MAX_INFLATE_DEPTH) {
    // ToDo: somehow display an explanation for the user why some images are not in groups anymore.
    childGroups = [];
  } else {
    childGroups = imageGroup.groups
      .reduce(getImageGroups, [])
      .map(inflateImageGroup(depth + 1, stateImageMap, singleUsageResult))
      .reduce(reduceEmptyGroups, []);

  }

  const images = filterAndTagImages(imageGroup.images, childGroups, stateImageMap);

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

const workerApi: TreeContextWorkerApi = {
  async calculate(params: CalculateRootWorkerParams): Promise<CalculateRootWorkerResult> {
    const startTime = performance.now();
    const { imageGroups, stateImages } = params;

    const stateImageMap = new Map(stateImages.map((img) => [img.hash, img]));

    // the .images property of any cleaned group will contain an image only once across all groups.
    // e.g.: if an image is a child of multiple groups, it will be removed from every group but one.
    // -> an image can only ever be member of a single group
    const singleUsageResult = ensureSingleUsage(imageGroups);

    const rootChildGroups = singleUsageResult.groups
      .map(inflateImageGroup(0, stateImageMap, singleUsageResult)) // convert serializable to tree
      .reduce(reduceEmptyGroups, []) // remove groups without images_and_groups
      .filter(({ id }) => !singleUsageResult.usedGroupIDs.includes(id)); // remove groups which are children of other groups

    const rootImageHashes = stateImages.reduce((acc: string[], { hash }: Image): string[] => (
      !singleUsageResult.usedImageHashes.includes(hash) ? [...acc, hash] : acc
    ), []); // remove images which are children of other groups

    const root = {
      ...createTreeRoot(),
      groups: rootChildGroups,
      images: filterAndTagImages(rootImageHashes, rootChildGroups, stateImageMap),
    };

    const usedPaths = new Set<string>();
    const paths = reducePaths('', root.groups, usedPaths);

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
      root,
      paths,
      pathsOptions,
      duration: performance.now() - startTime,
    };

    return result;
  },
};

expose(workerApi);
