import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useFrames } from '@/hooks/useFrames';
import { useStores } from '@/hooks/useStores';
import { framesListQueryOptions } from '@/stores/items/queries/frames';
import { imagesListQueryOptions } from '@/stores/items/queries/images';
import { compressAndHashFrame, loadFrameData, saveFrameData } from '@/tools/applyFrame/frameData';
import { getFrameFromFullTiles } from '@/tools/getFrameFromFullTiles';
import { reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { padFrameData } from '@/tools/saveLocalStorageItems';
import { load } from '@/tools/storage';
import { Frame } from '@/types/Frame';
import { Image } from '@/types/Image';

export interface UseMigrateFrames {
  convertFormat: () => Promise<void>;
  detectAndApply: () => Promise<void>;
}

export const useMigrateFrames = (): UseMigrateFrames => {
  const { updateFrames } = useFrames({});
  const queryClient = useQueryClient();
  const { updateImages } = useStores();

  // ToDo: add a migration for this function
  const convertFormat = useCallback(async () => {
    const { items: frames } = await queryClient.fetchQuery(framesListQueryOptions());
    const updatedFrames = await Promise.all(frames.map(async (frame): Promise<Frame | null> => {
      const stateData = await loadFrameData(frame.hash);

      if (!stateData) {
        return frame;
      }

      const imageStartLine = stateData.upper.length / 20;
      const tileData = padFrameData(stateData);

      const { dataHash: newHash } = await compressAndHashFrame(tileData, imageStartLine);


      if (frame.hash === newHash) {
        return null;
      }

      const saveHash = await saveFrameData(tileData, imageStartLine);

      return {
        ...frame,
        hash: saveHash,
      };
    }));

    const filtered = updatedFrames.filter((frame): frame is Frame => Boolean(frame));

    console.log(`will update ${filtered.length} frames to new format`);
    updateFrames(filtered);
  }, [updateFrames, queryClient]);

  const detectAndApply = useCallback(async () => {
    const { items: frames } = await queryClient.fetchQuery(framesListQueryOptions());
    const { items: images } = await queryClient.fetchQuery(imagesListQueryOptions());
    const unframedImages = images
      .filter(({ frame }: Image) => !frame)
      .reduce(reduceImagesMonochrome, [])
    ;

    const updatedImages: Image[] = [];

    console.log(`found ${unframedImages.length} images without frame`);

    for (const image of unframedImages) {
      const tiles = await load(image.hash, undefined, true);

      if (!tiles || tiles.length !== 360) { continue; }

      const frameData = getFrameFromFullTiles(tiles, 2);
      const frameTileData = padFrameData(frameData);
      const { dataHash } = await compressAndHashFrame(frameTileData, 2);

      const frame = frames.find(({ hash }) => (hash === dataHash));

      if (!frame) {
        console.log(`unknown frame in image "${image.title}"`);
        continue;
      }


      updatedImages.push({
        ...image,
        frame: frame.id,
      });
    }

    console.log(`will update ${updatedImages.length} with correct frame`);
    await updateImages(updatedImages);
  }, [queryClient, updateImages]);

  return {
    convertFormat,
    detectAndApply,
  };
};
