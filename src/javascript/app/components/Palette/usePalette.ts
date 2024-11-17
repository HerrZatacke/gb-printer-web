import { useDispatch } from 'react-redux';
import { Actions } from '../../store/actions';
import type { PaletteCloneAction, PaletteEditAction } from '../../../../types/actions/PaletteActions';
import useDialogsStore from '../../stores/dialogsStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import useStoragesStore from '../../stores/storagesStore';

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
  const { setSyncLastUpdate } = useStoragesStore();
  const { deletePalette } = useItemsStore();

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

          setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));
          deletePalette(shortName);
          dismissDialog(0);
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
