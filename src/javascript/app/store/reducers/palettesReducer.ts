/* eslint-disable default-param-last */
import { Actions } from '../actions';
import uniqueBy from '../../../tools/unique/by';
import { GlobalUpdateAction } from '../../../../types/GlobalUpdateAction';
import { PaletteDeleteAction, PaletteUpdateAction } from '../../../../types/actions/PaletteActions';
import { Palette } from '../../../../types/Palette';

const palettesReducer = (
  value: Palette[] = [],
  action:
    PaletteUpdateAction |
    PaletteDeleteAction |
    GlobalUpdateAction,
): Palette[] => {
  switch (action.type) {
    case Actions.PALETTE_DELETE:
      return [...value.filter(({ shortName }) => shortName !== action.payload.shortName)];
    case Actions.PALETTE_UPDATE:
      return uniqueBy<Palette>('shortName')([
        ...value.map((palette) => (
          palette.shortName !== action.payload.shortName ? palette : action.payload
        )),
        action.payload, // append as last one in case it's a new palette (duplicates will be removed by uniqueBy)
      ]);
    case Actions.GLOBAL_UPDATE:
      return uniqueBy<Palette>('shortName')([...(action.payload?.palettes || []), ...value]);
    default:
      return value;
  }
};

export default palettesReducer;
