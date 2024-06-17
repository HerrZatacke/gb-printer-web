import uniqueBy from '../unique/by';
import type { ExportableState, State } from '../../app/store/State';
import type { Frame } from '../../../types/Frame';
import type { Image } from '../../../types/Image';
import type { Palette } from '../../../types/Palette';

const mergeBy = <T>(by: keyof T) => {
  const unique = uniqueBy<T>(by);
  return (current: T[], update: T[]) => {
    const mergedUpdate = update.map((item) => {
      const existingItem = current.find((storeItem) => storeItem[by] === item[by]);
      if (!existingItem) {
        return item;
      }

      return {
        ...existingItem,
        ...item,
      };
    });

    return unique([...mergedUpdate, ...current]);
  };
};

const mergeImages = mergeBy<Image>('hash');
const mergeFrames = mergeBy<Frame>('id');
const mergePalettes = mergeBy<Palette>('shortName');

const mergeStates = (currentState: State, updatedState: ExportableState, mergeImagesFrames: boolean) => {

  let frames = currentState.frames;
  let images = currentState.images;
  let palettes = currentState.palettes;

  if (mergeImagesFrames) {
    if (updatedState.frames && updatedState.frames.length) {
      frames = mergeFrames(frames, updatedState.frames);
    }

    if (updatedState.images && updatedState.images.length) {
      images = mergeImages(images, updatedState.images);
    }

    if (updatedState.palettes && updatedState.palettes.length) {
      palettes = mergePalettes(palettes, updatedState.palettes);
    }
  } else {
    frames = updatedState.frames || currentState.frames;
    images = updatedState.images || currentState.images;
    palettes = updatedState.palettes || currentState.palettes;
  }

  return {
    ...currentState,
    ...updatedState,
    images,
    frames,
    palettes,
  };
};

export default mergeStates;
