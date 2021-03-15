import updateIfDefined from '../../../tools/updateIfDefined';

const activePaletteReducer = (value = 'cybl', action) => {
  switch (action.type) {
    case 'PALETTE_SET_ACTIVE':
      return action.payload;
    case 'GLOBAL_UPDATE':
      return updateIfDefined(action.payload.activePalette, value);
    case 'PALETTE_DELETE':
      return action.payload.newSelectedPalette || value;
    default:
      return value;
  }
};

export default activePaletteReducer;
