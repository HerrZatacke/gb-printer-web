import applyTagChanges from '../../../tools/applyTagChanges';
import { NEW_PALETTE_SHORT } from '../../../consts/specialTags';

const dispatchSetEditPalette = (dispatch, palettes, paletteShortName) => {
  const editPalette = (paletteShortName === NEW_PALETTE_SHORT) ? ({
    name: '',
    shortName: NEW_PALETTE_SHORT,
    palette: ['#ffffff', '#b7b7b7', '#757575', '#002091'],
    origin: 'Selfmade',
  }) : (
    palettes.find(({ shortName }) => shortName === paletteShortName)
  );

  dispatch({
    type: 'SET_EDIT_PALETTE',
    payload: {
      ...editPalette,
    },
  });
};

const dispatchSaveEditPalette = (dispatch, state) => {
  dispatch({
    type: 'PALETTE_UPDATE',
    payload: {
      ...state.editPalette,
      tags: applyTagChanges(state.editPalette.tags),
    },
  });
};

const saveEditPalette = (store) => {

  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && ev.ctrlKey && store.getState().editPalette.hash) {
      const state = store.getState();

      store.dispatch({
        type: 'SAVE_EDIT_PALETTE',
      });

      if (state.editPalette) {
        ev.preventDefault();
      }
    }
  });

  return (next) => (action) => {

    switch (action.type) {
      case 'SAVE_EDIT_PALETTE':
        dispatchSaveEditPalette(store.dispatch, store.getState());
        return;

      case 'PALETTE_EDIT':
        dispatchSetEditPalette(store.dispatch, store.getState().palettes, action.payload);
        return;
      default:
    }

    next(action);
  };
};


export default saveEditPalette;
