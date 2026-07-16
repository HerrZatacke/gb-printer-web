import { useMemo } from 'react';
import { useFrameGroups } from '@/hooks/useFrameGroups';
import { useFrames } from '@/hooks/useFrames';
import { usePalettes } from '@/hooks/usePalettes';
import {
  ImageSelectionMode,
  useDialogsStore,
  useEditStore,
  useFiltersStore,
  useImportsStore,
  useInteractionsStore,
  useItemsStore,
  useStoragesStore,
} from '@/stores/stores';
import { Date } from '@/tools/safeDate';
import { type Dialog } from '@/types/Dialog';
import { type ExportableState } from '@/types/ExportState';
import { type Image } from '@/types/Image';

export interface UseStores {
  addImages: (images: Image[]) => void;
  deleteImages: (hashes: string[]) => void;
  dismissDialog: (index: number) => void;
  globalUpdate: (state: Partial<ExportableState>) => void;
  importQueueCancel: () => void;
  setDialog: (dialog: Dialog) => void;
  updateImages: (images: Image[]) => void;
  updateLastSyncLocalNow: () => void;
}

export const useStores = (): UseStores => {
  const { dismissDialog, setDialog } = useDialogsStore();
  const { cancelEditFrame, cancelEditImages, cancelEditPalette } = useEditStore();
  const { updateRecentImports, updateImageSelection } = useFiltersStore();
  const { importQueueCancel } = useImportsStore();
  const { setPrinterBusy } = useInteractionsStore();
  const {
    addImages,
    deleteImages,
    setImageGroups,
    updateImages,
    setImages,
  } = useItemsStore();

  const { setSyncLastUpdate } = useStoragesStore();
  const { updatePalettes } = usePalettes({});
  const { updateFrames } = useFrames({});
  const { updateFrameGroups } = useFrameGroups();

  return useMemo(() => {
    const updateLastSyncLocalNow = () => setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));

    const combinedImportQueueCancel = () => {
      setPrinterBusy(false);
      importQueueCancel();
    };

    const combinedAddImages = (images: Image[]) => {
      addImages(images);
      dismissDialog(0);
      updateLastSyncLocalNow();
      combinedImportQueueCancel();
      updateRecentImports(images);
    };

    const combinedUpdateImages = (images: Image[]) => {
      updateImages(images);
      updateLastSyncLocalNow();
    };

    const combinedDeleteImages = (hashes: string[]) => {
      deleteImages(hashes);
      updateImageSelection(ImageSelectionMode.REMOVE, hashes);
      dismissDialog(0);
      updateLastSyncLocalNow();
    };

    const combinedGlobalUpdate = (state: Partial<ExportableState>) => {
      cancelEditFrame();
      cancelEditPalette();
      cancelEditImages();

      if (state.lastUpdateUTC) {
        setSyncLastUpdate('local', state.lastUpdateUTC);
      } else {
        updateLastSyncLocalNow();
      }

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      if (state.palettes) {
        // hard replace all palettes -> merging happens in src/javascript/tools/mergeStates/index.ts
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        updatePalettes(state.palettes);
      }

      if (state.images) {
        // hard replace all images -> merging happens in src/javascript/tools/mergeStates/index.ts
        setImages(state.images);
        updateRecentImports(state.images);
      }

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      if (state.frames) {
        // hard replace all frames -> merging happens in src/javascript/tools/mergeStates/index.ts
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        updateFrames(state.frames);
      }

      // eslint-disable-next-line @typescript-eslint/no-deprecated
      if (state.frameGroups) {
        // eslint-disable-next-line @typescript-eslint/no-deprecated
        updateFrameGroups(state.frameGroups); // updateFrameGroups merges
      }

      if (state.imageGroups) {
        setImageGroups(state.imageGroups);
      }
    };

    return ({
      addImages: combinedAddImages,
      deleteImages: combinedDeleteImages,
      dismissDialog,
      globalUpdate: combinedGlobalUpdate,
      importQueueCancel: combinedImportQueueCancel,
      setDialog,
      updateImages: combinedUpdateImages,
      updateLastSyncLocalNow,
    });
  }, [
    addImages,
    cancelEditFrame,
    cancelEditImages,
    cancelEditPalette,
    deleteImages,
    dismissDialog,
    importQueueCancel,
    setDialog,
    updateFrames,
    setImages,
    updatePalettes,
    setImageGroups,
    setPrinterBusy,
    setSyncLastUpdate,
    updateFrameGroups,
    updateImageSelection,
    updateImages,
    updateRecentImports,
  ]);
};
