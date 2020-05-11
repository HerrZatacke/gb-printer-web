const activePaletteReducer = (value = 'cybl', action) => {
  switch (action.type) {
    case 'PALETTE_SET_ACTIVE':
      return action.payload;
    default:
      return value;
  }
};

export default activePaletteReducer;
