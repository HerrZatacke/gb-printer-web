import { useDispatch, useSelector } from 'react-redux';
import { NEW_PALETTE_SHORT } from '../../../consts/SpecialTags';
import { Actions } from '../../store/actions';
import type { State } from '../../store/State';
import type { Palette } from '../../../../types/Palette';
import type { PaletteEditAction } from '../../../../types/actions/PaletteActions';

interface UsePalettes {
  palettes: Palette[],
  newPalette: () => void,
}

export const usePalettes = (): UsePalettes => {
  const palettes = useSelector((state: State) => state.palettes);
  const dispatch = useDispatch();

  return {
    palettes,
    newPalette: () => {
      dispatch<PaletteEditAction>({
        type: Actions.PALETTE_EDIT,
        payload: NEW_PALETTE_SHORT,
      });
    },
  };
};
