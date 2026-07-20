import { useTranslations } from 'next-intl';
import { usePalettes } from '@/hooks/usePalettes';
import useEditPalette from '@/hooks/useSetEditPalette';
import { useStores } from '@/hooks/useStores';
import {
  useDialogsStore,
  useSettingsStore,
} from '@/stores/stores';

interface UsePalette {
  isActive: boolean;
  setActive: () => void;
  deletePalette: () => void;
  editPalette: () => Promise<void>;
  clonePalette: () => void;
}

export const usePalette = (shortName: string, name: string): UsePalette => {
  const t = useTranslations('usePalette');
  const { activePalette, setActivePalette } = useSettingsStore();
  const { dismissDialog, setDialog } = useDialogsStore();
  const { updateLastSyncLocalNow } = useStores();
  const { deletePalettesByShortNames } = usePalettes({});
  const { editPalette, clonePalette } = useEditPalette();
  const isActive = activePalette === shortName;


  return {
    isActive,
    setActive: () => setActivePalette(shortName),
    deletePalette: () => {
      setDialog({
        message: t('deletePaletteMessage', { name: name || 'no name' }),
        confirm: async () => {
          if (isActive) {
            setActivePalette('dsh');
          }

          updateLastSyncLocalNow();
          deletePalettesByShortNames([shortName]);
          dismissDialog(0);
        },
        deny: async () => dismissDialog(0),
      });
    },
    editPalette: async () => editPalette(shortName),
    clonePalette: () => clonePalette(shortName),
  };
};
