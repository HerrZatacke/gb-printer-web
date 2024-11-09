import useEditStore from '../../stores/editStore';
import { NEW_PALETTE_SHORT } from '../../../consts/SpecialTags';
import { Actions } from '../actions';
import type { MiddlewareWithState } from '../../../../types/MiddlewareWithState';
import type { Palette } from '../../../../types/Palette';

const randomColor = (max: number): string => (
  [
    '#',
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
    Math.ceil(Math.random() * max).toString(16).padStart(2, '0'),
  ].join('')
);

const randomPalette = (): Palette => ({
  name: '',
  shortName: NEW_PALETTE_SHORT,
  palette: [
    randomColor(0xff),
    randomColor(0xaa),
    randomColor(0x66),
    randomColor(0x22),
  ],
  origin: '',
  isPredefined: false,
});

const dispatchSetEditPalette = (
  palettes: Palette[],
  paletteShortName: string,
  clone: boolean,
) => {
  const editPalette: Palette = (paletteShortName === NEW_PALETTE_SHORT) ? randomPalette() : (
    palettes.find(({ shortName }) => shortName === paletteShortName) || randomPalette()
  );

  useEditStore.getState().setEditPalette({
    ...editPalette,
    name: clone ? `Copy of ${editPalette.name}` : editPalette.name,
    shortName: clone ? NEW_PALETTE_SHORT : paletteShortName,
  });
};

const saveEditPalette: MiddlewareWithState = (store) => (next) => (action) => {
  switch (action.type) {
    case Actions.PALETTE_EDIT:
      dispatchSetEditPalette(store.getState().palettes, action.payload, false);
      return;

    case Actions.PALETTE_CLONE:
      dispatchSetEditPalette(store.getState().palettes, action.payload, true);
      return;
    default:
  }

  next(action);
};


export default saveEditPalette;
