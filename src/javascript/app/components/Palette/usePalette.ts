import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import {
  PaletteDeleteAction,
  PaletteEditAction,
  PaletteSetActiveAction,
} from '../../../../types/actions/PaletteActions';
import { ConfirmAskAction } from '../../../../types/actions/ConfirmActions';

interface UsePalette {
  isActive: boolean
  setActive: () => void,
  deletePalette: () => void,
  editPalette: () => void,
  clonePalette: () => void,
}

export const usePalette = (shortName: string, name: string): UsePalette => {
  const isActive = useSelector((state: State) => state.activePalette === shortName);
  const dispatch = useDispatch();

  return {
    isActive,
    setActive: () => {
      dispatch({
        type: Actions.PALETTE_SET_ACTIVE,
        payload: shortName,
      } as PaletteSetActiveAction);
    },
    deletePalette: () => {
      dispatch({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: `Delete palette "${name || 'no name'}"?`,
          confirm: () => {
            dispatch({
              type: Actions.PALETTE_DELETE,
              payload: { shortName },
            } as PaletteDeleteAction);
          },
          deny: () => {
            dispatch({
              type: Actions.CONFIRM_ANSWERED,
            });
          },
        },
      } as ConfirmAskAction);
    },
    editPalette: () => {
      dispatch({
        type: Actions.PALETTE_EDIT,
        payload: shortName,
      } as PaletteEditAction);
    },
    clonePalette: () => {
      dispatch({
        type: Actions.PALETTE_CLONE,
        payload: shortName,
      });
    },
  };
};
