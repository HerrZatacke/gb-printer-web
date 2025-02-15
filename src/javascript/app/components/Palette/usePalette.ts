import useDialogsStore from '../../stores/dialogsStore';
import useItemsStore from '../../stores/itemsStore';
import useSettingsStore from '../../stores/settingsStore';
import useEditPalette from '../../../hooks/useSetEditPalette';
import { useStores } from '../../../hooks/useStores';

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
  const { updateLastSyncLocalNow } = useStores();
  const { deletePalette } = useItemsStore();
  const { editPalette, clonePalette } = useEditPalette();
  const isActive = activePalette === shortName;


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

          updateLastSyncLocalNow();
          deletePalette(shortName);
          dismissDialog(0);
        },
        deny: async () => dismissDialog(0),
      });
    },
    editPalette: () => editPalette(shortName),
    clonePalette: () => clonePalette(shortName),
  };
};
