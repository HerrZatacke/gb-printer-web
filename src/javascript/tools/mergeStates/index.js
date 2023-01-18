import uniqueBy from '../unique/by';

const mergeBy = (by) => {
  const unique = uniqueBy(by);
  return (current, update) => {
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

const mergeByHash = mergeBy('hash');
const mergeById = mergeBy('id');
const mergeByShortName = mergeBy('shortName');

const mergeStates = (currentState, updatedState, mergeImagesFrames) => {

  let frames = currentState.frames;
  let images = currentState.images;
  let palettes = currentState.palettes;

  if (mergeImagesFrames) {
    if (updatedState.frames && updatedState.frames.length) {
      frames = mergeById(frames, updatedState.frames);
    }

    if (updatedState.images && updatedState.images.length) {
      images = mergeByHash(images, updatedState.images);
    }

    if (updatedState.palettes && updatedState.palettes.length) {
      palettes = mergeByShortName(palettes, updatedState.palettes);
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
