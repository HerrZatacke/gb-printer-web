import applyTagChanges from '../../../tools/applyTagChanges';
import { NEW_PALETTE_SHORT } from '../../../consts/specialTags';
import {
  PALETTE_CLONE,
  PALETTE_EDIT,
  PALETTE_UPDATE,
  SAVE_EDIT_PALETTE,
  SET_EDIT_PALETTE,
} from '../actions';

const randomColor = (max) => (
  [
    '#',
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
  ].join('')
);

const dispatchSetEditPalette = (dispatch, palettes, paletteShortName, clone) => {
  const editPalette = (paletteShortName === NEW_PALETTE_SHORT) ? ({
    name: '',
    shortName: NEW_PALETTE_SHORT,
    palette: [
      randomColor(0xff),
      randomColor(0xaa),
      randomColor(0x66),
      randomColor(0x22),
    ],
    origin: 'Selfmade',
  }) : (
    palettes.find(({ shortName }) => shortName === paletteShortName)
  );

  dispatch({
    type: SET_EDIT_PALETTE,
    payload: {
      ...editPalette,
      name: clone ? `Copy of ${editPalette.name}` : editPalette.name,
      shortName: clone ? NEW_PALETTE_SHORT : paletteShortName,
    },
  });
};

const dispatchSaveEditPalette = (dispatch, state) => {
  dispatch({
    type: PALETTE_UPDATE,
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
        type: SAVE_EDIT_PALETTE,
      });

      if (state.editPalette) {
        ev.preventDefault();
      }
    }
  });

  return (next) => (action) => {

    switch (action.type) {
      case SAVE_EDIT_PALETTE:
        dispatchSaveEditPalette(store.dispatch, store.getState());
        return;

      case PALETTE_EDIT:
        dispatchSetEditPalette(store.dispatch, store.getState().palettes, action.payload, false);
        return;

      case PALETTE_CLONE:
        dispatchSetEditPalette(store.dispatch, store.getState().palettes, action.payload, true);
        return;
      default:
    }

    next(action);
  };
};


export default saveEditPalette;
