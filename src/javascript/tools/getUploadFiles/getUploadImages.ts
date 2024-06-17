import type { RGBNTiles } from 'gb-image-decoder';
import { ExportFrameMode } from 'gb-image-decoder';
import type { Image, MonochromeImage, RGBNImage } from '../../../types/Image';
import { isRGBNImage, reduceImagesMonochrome } from '../isRGBNImage';
import type { AddToQueueFn } from '../../../types/Sync';
import type { RepoContents, RepoFile, SyncFile } from '../../../types/Export';
import getImagePalette from '../getImagePalette';
import type { State } from '../../app/store/State';
import { loadImageTiles as getLoadImageTiles } from '../loadImageTiles';
import getPrepareFiles from '../download/getPrepareFiles';
import type { Palette } from '../../../types/Palette';

interface TmpInfo {
  file: Image,
  inRepo: RepoFile[],
  searchHashes: string[],
}

export const getUploadImages = async (
  state: State,
  repoContents: RepoContents,
  addToQueue: AddToQueueFn<SyncFile | null>,
): Promise<{
  syncImages: SyncFile[],
  missingLocally: string[],
}> => {
  const loadImageTiles = getLoadImageTiles(state);
  const exportFileTypes = ['txt'];
  const exportScaleFactors = [1];
  const prepareFiles = getPrepareFiles({
    ...state,
    exportScaleFactors,
    exportFileTypes,
    handleExportFrame: ExportFrameMode.FRAMEMODE_KEEP,
  });

  const missingLocally: string[] = [];

  const images: TmpInfo[] = state.images

    // ToDo: This removes RGBN images - can we handle this?
    .reduce(reduceImagesMonochrome, [])

    .map((image: Image): TmpInfo => {
      const searchHashes: string[] = isRGBNImage(image) ? Object.values((image as RGBNImage).hashes) : [image.hash];

      return ({
        file: image,
        searchHashes,
        inRepo: ([
          repoContents.images.find(({ hash }: RepoFile) => searchHashes.includes(hash)),
        ].filter(Boolean) as RepoFile[]),
      });
    });
  const imagesLength = images.length;

  const syncImages: (SyncFile | null)[] = await Promise.all(
    images.map(async (tmpInfo: TmpInfo, index: number): Promise<SyncFile | null> => {

      const image = tmpInfo.file as MonochromeImage;

      if (tmpInfo.inRepo.length === tmpInfo.searchHashes.length) {
        return {
          ...image,
          inRepo: tmpInfo.inRepo,
          files: [],
        };
      }

      return addToQueue(`loadImageTiles (${index + 1}/${imagesLength}) ${image.title}`, 3, async (): Promise<SyncFile | null> => {
        const tiles = await loadImageTiles(image.hash, true);

        if (
          !(tiles as string[]).length ||
          (tiles as RGBNTiles).r ||
          (tiles as RGBNTiles).g ||
          (tiles as RGBNTiles).b ||
          (tiles as RGBNTiles).n
        ) {
          // eslint-disable-next-line no-console
          console.log('ToDo !!!!'); // ToDo: handle RGBN Images
          missingLocally.push(image.hash);
          return null;
        }

        const palette = getImagePalette(state, image) as Palette;

        const files = await prepareFiles(palette, image)(tiles as string[]);

        return {
          ...image,
          inRepo: tmpInfo.inRepo,
          files,
        };
      });
    }),
  );

  return {
    syncImages: (syncImages.filter(Boolean) as SyncFile[]),
    missingLocally,
  };
};
