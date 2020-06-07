const activePaletteReducer = (value = 'cybl', action) => {
  switch (action.type) {
    case 'PALETTE_SET_ACTIVE':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return action.payload.activePalette || value;
    default:
      return value;
  }
};

export default activePaletteReducer;
