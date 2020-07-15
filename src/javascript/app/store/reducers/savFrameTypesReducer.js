const savFrameTypesReducer = (value = 'int', action) => {
  switch (action.type) {
    case 'SET_SAV_FRAME_TYPES':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return action.payload.savFrameTypes || value;
    default:
      return value;
  }
};

export default savFrameTypesReducer;
