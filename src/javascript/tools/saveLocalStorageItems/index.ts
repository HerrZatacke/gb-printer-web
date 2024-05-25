import { load, save } from '../storage';
import { loadFrameData, saveFrameData } from '../applyFrame/frameData';
import { RepoContents } from '../../../types/Sync';

export const saveImageFileContent = async (fileContent: string): Promise<string> => {

  const lines = fileContent
    .split('\n')
    .filter((line) => line.match(/^[0-9a-f ]+$/gi));

  return save(lines);
};

export const saveFrameFileContent = async (fileContent: string): Promise<string> => {
  const tiles = JSON.parse(fileContent);
  const black = Array(32)
    .fill('f')
    .join('');
  const pad = Array(16)
    .fill(black);

  // tiles need to be padded with some lines that get stripped again when saving frame data
  const paddedFrameData = [
    ...tiles.upper,
    ...Array(14)
      .fill('')
      .map((_, index) => ([
        ...tiles.left[index],
        ...pad,
        ...tiles.right[index],
      ]))
      .flat(),
    ...tiles.lower,
  ];
  return saveFrameData(paddedFrameData);
};

const saveLocalStorageItems = async ({ images, frames }: RepoContents): Promise<string[]> => {
  const imagesDone = await Promise.all(images.map(async (image): Promise<string> => {
    const tiles = await load(image.hash, undefined, true);
    if (tiles?.length) {
      return image.hash;
    }

    const imageContent = await image.getFileContent();
    return saveImageFileContent(imageContent);
  }));


  const framesDone = await Promise.all(frames.map(async (frame): Promise<string> => {
    const frameData = await loadFrameData(frame.hash);
    if (frameData) {
      return frame.hash;
    }

    const frameFileContent = await frame.getFileContent();
    return saveFrameFileContent(frameFileContent);
  }));

  return [...imagesDone, ...framesDone];
};

export default saveLocalStorageItems;
