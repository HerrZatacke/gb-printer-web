const mergeStates = (currentState, updatedState) => {
  const frames = updatedState.frames || currentState.frames;

  // ToDo when palettes are editable
  // const palettes = updatedState.palettes || currentState.palettes;

  const images = updatedState.images || currentState.images;

  return {
    ...currentState,
    ...updatedState,
    images,
    frames,
  };
};

export default mergeStates;
