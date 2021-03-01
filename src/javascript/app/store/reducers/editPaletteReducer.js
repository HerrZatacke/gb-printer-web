const editPaletteReducer = (value = {}, action) => {
  switch (action.type) {
    case 'SET_EDIT_PALETTE':
      return action.payload;
    case 'PALETTE_CANCEL_EDIT':
    case 'PALETTE_UPDATE':
    case 'CLOSE_OVERLAY':
      return {};
    default:
      return value;
  }
};

export default editPaletteReducer;
