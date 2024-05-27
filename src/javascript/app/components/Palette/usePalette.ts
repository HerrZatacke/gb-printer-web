import { useDispatch, useSelector } from 'react-redux';
import { Actions } from '../../store/actions';
import { State } from '../../store/State';
import {
  PaletteCloneAction,
  PaletteDeleteAction,
  PaletteEditAction,
  PaletteSetActiveAction,
} from '../../../../types/actions/PaletteActions';
import { ConfirmAnsweredAction, ConfirmAskAction } from '../../../../types/actions/ConfirmActions';

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
      dispatch<PaletteSetActiveAction>({
        type: Actions.PALETTE_SET_ACTIVE,
        payload: shortName,
      });
    },
    deletePalette: () => {
      dispatch<ConfirmAskAction>({
        type: Actions.CONFIRM_ASK,
        payload: {
          message: `Delete palette "${name || 'no name'}"?`,
          confirm: async () => {
            dispatch<PaletteDeleteAction>({
              type: Actions.PALETTE_DELETE,
              payload: { shortName },
            });
          },
          deny: async () => {
            dispatch<ConfirmAnsweredAction>({
              type: Actions.CONFIRM_ANSWERED,
            });
          },
        },
      });
    },
    editPalette: () => {
      dispatch<PaletteEditAction>({
        type: Actions.PALETTE_EDIT,
        payload: shortName,
      });
    },
    clonePalette: () => {
      dispatch<PaletteCloneAction>({
        type: Actions.PALETTE_CLONE,
        payload: shortName,
      });
    },
  };
};
