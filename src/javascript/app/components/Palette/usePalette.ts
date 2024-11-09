import { useDispatch } from 'react-redux';
import { Actions } from '../../store/actions';
import type {
  PaletteCloneAction,
  PaletteDeleteAction,
  PaletteEditAction,
} from '../../../../types/actions/PaletteActions';
import useDialogsStore from '../../stores/dialogsStore';
import useSettingsStore from '../../stores/settingsStore';

interface UsePalette {
  isActive: boolean
  setActive: () => void,
  deletePalette: () => void,
  editPalette: () => void,
  clonePalette: () => void,
}

export const usePalette = (shortName: string, name: string): UsePalette => {
  const { activePalette, setActivePalette } = useSettingsStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const isActive = activePalette === shortName;
  const dispatch = useDispatch();


  return {
    isActive,
    setActive: () => setActivePalette(shortName),
    deletePalette: () => {
      setDialog({
        message: `Delete palette "${name || 'no name'}"?`,
        confirm: async () => {
          if (isActive) {
            setActivePalette('dsh');
          }

          dispatch<PaletteDeleteAction>({
            type: Actions.PALETTE_DELETE,
            payload: shortName,
          });
        },
        deny: async () => dismissDialog(0),
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
