const mergeStates = (currentState, updatedState, mergeImagesFrames) => {

  let frames = [];
  let images = [];
  // ToDo when palettes are editable
  // let palettes = [];

  if (mergeImagesFrames) {
    if (updatedState.frames) {
      frames = [...updatedState.frames, ...currentState.frames];
    }

    if (updatedState.images) {
      images = [...updatedState.images, ...currentState.images];
    }

    // if (updatedState.palettes) {
    //   palettes = [...updatedState.palettes, ...currentState.palettes];
    // }
  } else {
    frames = updatedState.frames || currentState.frames;
    images = updatedState.images || currentState.images;
    // palettes = updatedState.palettes || currentState.palettes;
  }

  return {
    ...currentState,
    ...updatedState,
    images,
    frames,
  };
};

export default mergeStates;
