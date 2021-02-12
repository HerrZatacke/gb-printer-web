const mergeStates = (currentState, updatedState, mergeImagesFrames) => {

  let frames = currentState.frames;
  let images = currentState.images;
  // ToDo when palettes are editable
  // let palettes = currentState.palettes;

  if (mergeImagesFrames) {
    if (updatedState.frames && updatedState.frames.length) {
      frames.push(...updatedState.frames);
    }

    if (updatedState.images && updatedState.images.length) {
      images.push(...updatedState.images);
    }

    // if (updatedState.palettes && updatedState.palettes.length) {
    //   palettes.push(...updatedState.palettes);
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
