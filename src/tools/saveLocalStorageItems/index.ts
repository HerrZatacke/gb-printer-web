import { loadFrameData, saveFrameData } from '@/tools/applyFrame/frameData';
import type { FrameData } from '@/tools/applyFrame/frameData';
import { isRGBNImage } from '@/tools/isRGBNImage';
import { reduceItems } from '@/tools/reduceArray';
import { load, save } from '@/tools/storage';
import type { RepoContents } from '@/types/Export';
import type { JSONExportState } from '@/types/ExportState';
import type { Frame } from '@/types/Frame';
import type { Image, RGBNHashes, RGBNImage } from '@/types/Image';

interface RehashedItem {
  oldHash: string,
  newHash: string,
}

export const saveImageFileContent = async (fileContent: string): Promise<string> => {

  const lines = fileContent
    .split('\n')
    .filter((line) => line.match(/^[0-9a-f ]+$/gi));

  return save(lines);
};

export const padFrameData = (frameData: FrameData): string[] => {
  const black = Array(32)
    .fill('f')
    .join('');
  const pad = Array(16)
    .fill(black);

  const paddedFrameData = [
    ...frameData.upper,
    ...Array(14)
      .fill('')
      .map((_, index) => ([
        ...frameData.left[index],
        ...pad,
        ...frameData.right[index],
      ]))
      .flat(),
    ...frameData.lower,
  ];

  return paddedFrameData;
};

export const saveFrameFileContent = async (fileContent: string): Promise<string> => {
  const tiles = JSON.parse(fileContent) as FrameData;
  const imageStartLine = tiles.upper.length / 20;

  // tiles need to be padded with some lines that get stripped again when saving frame data
  const paddedFrameData = padFrameData(tiles);
  return saveFrameData(paddedFrameData, imageStartLine);
};

const saveLocalStorageItems = async ({ images, frames, settings }: RepoContents): Promise<JSONExportState> => {
  const settingsImages = settings.state.images || [];
  const settingsFrames = settings.state.frames || [];

  const imagesRehashed = (
    await Promise.all(images.map(async (image): Promise<RehashedItem | undefined> => {
      const tiles = await load(image.hash, undefined, true);
      if (tiles?.length) {
        return undefined;
      }

      const imageContent = await image.getFileContent();
      const saveHash = await saveImageFileContent(imageContent);

      if (image.hash !== saveHash) {
        return {
          oldHash: image.hash,
          newHash: saveHash,
        };
      }

      return undefined;
    }))
  ).reduce(reduceItems<RehashedItem>, []);


  const framesRehashed = (
    await Promise.all(frames.map(async (frame): Promise<RehashedItem | undefined> => {
      const frameData = await loadFrameData(frame.hash);
      if (frameData) {
        return undefined;
      }

      const frameFileContent = await frame.getFileContent();

      const saveHash = await saveFrameFileContent(frameFileContent);

      if (frame.hash !== saveHash) {
        return {
          oldHash: frame.hash,
          newHash: saveHash,
        };
      }

      return undefined;
    }))
  ).reduce(reduceItems<RehashedItem>, []);

  const newImages: Image[] = settingsImages.map((settingsImage: Image): Image => {
    // If image is RGBN image
    if (isRGBNImage(settingsImage)) {
      const settingsImageRGBN = settingsImage as RGBNImage;

      const hashes: RGBNHashes = {
        ...settingsImageRGBN.hashes,
      };

      const hashUpdateR = imagesRehashed.find(({ oldHash }) => oldHash === settingsImageRGBN.hashes.r);
      const hashUpdateG = imagesRehashed.find(({ oldHash }) => oldHash === settingsImageRGBN.hashes.g);
      const hashUpdateB = imagesRehashed.find(({ oldHash }) => oldHash === settingsImageRGBN.hashes.b);
      const hashUpdateN = imagesRehashed.find(({ oldHash }) => oldHash === settingsImageRGBN.hashes.n);

      if (hashUpdateR?.newHash) {
        hashes.r = hashUpdateR?.newHash;
      }

      if (hashUpdateG?.newHash) {
        hashes.g = hashUpdateG?.newHash;
      }

      if (hashUpdateB?.newHash) {
        hashes.b = hashUpdateB?.newHash;
      }

      if (hashUpdateN?.newHash) {
        hashes.n = hashUpdateN?.newHash;
      }

      return {
        ...settingsImageRGBN,
        hashes,
      };
    }

    // If image is monochrome iamge
    const hashUpdate = imagesRehashed.find(({ oldHash }) => oldHash === settingsImage.hash);
    return {
      ...settingsImage,
      hash: hashUpdate?.newHash || settingsImage.hash,
    };
  });

  const newFrames: Frame[] = settingsFrames.map((settingsFrame: Frame): Frame => {
    const hashUpdate = framesRehashed.find(({ oldHash }) => oldHash === settingsFrame.hash);
    if (!hashUpdate) {
      return settingsFrame;
    }

    return {
      ...settingsFrame,
      hash: hashUpdate.newHash,
    };
  });

  const exportState: JSONExportState = {
    ...settings,
    state: {
      ...settings.state,
      images: newImages,
      frames: newFrames,
    },
  };

  return exportState;
};

export default saveLocalStorageItems;
