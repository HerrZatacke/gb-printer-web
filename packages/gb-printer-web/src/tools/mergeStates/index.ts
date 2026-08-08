import { type Palette , type Image } from 'gb-printer-schemas';
import { type SerializableImageGroup } from 'gb-printer-schemas';
import uniqueBy from '@/tools/unique/by';
import { type ExportableState } from '@/types/ExportState';
import { type Frame } from '@/types/Frame';

const mergeBy = <T>(by: keyof T) => {
  const unique = uniqueBy<T>(by);
  return (current: T[], update: T[]) => {
    const currentMap = new Map<T[typeof by], T>(
      current.map(item => [item[by], item]),
    );

    const mergedUpdate = update.map((item) => {
      const existing = currentMap.get(item[by]);
      return existing ? { ...existing, ...item } : item;
    });

    return unique([...mergedUpdate, ...current]);
  };
};

const mergeImages = mergeBy<Image>('hash');
const mergeFrames = mergeBy<Frame>('id');
const mergePalettes = mergeBy<Palette>('shortName');
const mergeImageGroups = mergeBy<SerializableImageGroup>('id');

const mergeStates = (
  currentStateFrames: Frame[],
  currentStatePalettes: Palette[],
  currentStateImages: Image[],
  currentStateImageGroups: SerializableImageGroup[],
  updatedState: ExportableState,
  isFromJsonImport: boolean,
): Partial<ExportableState> => {

  let frames = currentStateFrames;
  let images = currentStateImages;
  let palettes = currentStatePalettes;
  let imageGroups = currentStateImageGroups;

  if (isFromJsonImport) {
    if (updatedState.frames && updatedState.frames.length) {
      frames = mergeFrames(frames, updatedState.frames);
    }

    if (updatedState.images && updatedState.images.length) {
      images = mergeImages(images, updatedState.images);
    }

    if (updatedState.palettes && updatedState.palettes.length) {
      palettes = mergePalettes(palettes, updatedState.palettes);
    }

    if (updatedState.imageGroups && updatedState.imageGroups.length) {
      imageGroups = mergeImageGroups(imageGroups, updatedState.imageGroups as SerializableImageGroup[]);
    }
  } else {
    frames = updatedState.frames || currentStateFrames;
    images = updatedState.images || currentStateImages;
    palettes = updatedState.palettes || currentStatePalettes;
    imageGroups = updatedState.imageGroups || currentStateImageGroups;
  }

  return {
    ...updatedState,
    images,
    frames,
    palettes,
    imageGroups,
  };
};

export default mergeStates;
