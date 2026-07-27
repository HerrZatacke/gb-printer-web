import { useMemo } from 'react';
import { useFrameGroups } from '@/hooks/useFrameGroups';
import { useFrames } from '@/hooks/useFrames';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImages } from '@/hooks/useImages';
import { usePalettes } from '@/hooks/usePalettes';
import {
  ImageSelectionMode,
  useDialogsStore,
  useEditStore,
  useFiltersStore,
  useImportsStore,
  useInteractionsStore,
  useStoragesStore,
} from '@/stores/stores';
import { Date } from '@/tools/safeDate';
import { type Dialog } from '@/types/Dialog';
import { type ExportableState } from '@/types/ExportState';
import { type Image } from '@/types/Image';
import { SerializableImageGroup } from '@/types/ImageGroup';

export interface UseStores {
  addImages: (images: Image[]) => Promise<void>;
  deleteImages: (hashes: string[]) => Promise<void>;
  dismissDialog: (index: number) => void;
  globalUpdate: (state: Partial<ExportableState>) => Promise<void>;
  importQueueCancel: () => void;
  setDialog: (dialog: Dialog) => void;
  updateImages: (images: Image[]) => Promise<void>;
  updateLastSyncLocalNow: () => void;
}

export const useStores = (): UseStores => {
  const { dismissDialog, setDialog } = useDialogsStore();
  const { cancelEditFrame, cancelEditImages, cancelEditPalette } = useEditStore();
  const { updateRecentImports, updateImageSelection } = useFiltersStore();
  const { importQueueCancel } = useImportsStore();
  const { setPrinterBusy } = useInteractionsStore();

  const { updateImages, deleteImagesByHashes } = useImages({});
  const { updateImageGroups } = useImageGroups({});

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

    const combinedAddImages = async (images: Image[]) => {
      await updateImages(images);
      dismissDialog(0);
      updateLastSyncLocalNow();
      combinedImportQueueCancel();
      updateRecentImports(images);
    };

    const combinedUpdateImages = async (images: Image[]) => {
      await updateImages(images);
      updateLastSyncLocalNow();
    };

    const combinedDeleteImages = async (hashes: string[]) => {
      await deleteImagesByHashes(hashes);
      updateImageSelection(ImageSelectionMode.REMOVE, hashes);
      dismissDialog(0);
      updateLastSyncLocalNow();
    };

    const combinedGlobalUpdate = async (state: Partial<ExportableState>) => {
      cancelEditFrame();
      cancelEditPalette();
      cancelEditImages();

      if (state.lastUpdateUTC) {
        setSyncLastUpdate('local', state.lastUpdateUTC);
      } else {
        updateLastSyncLocalNow();
      }

      if (state.palettes) {
        // hard replace all palettes -> merging happens in src/javascript/tools/mergeStates/index.ts
        await updatePalettes(state.palettes);
      }

      if (state.images) {
        // hard replace all images -> merging happens in src/javascript/tools/mergeStates/index.ts
        await updateImages(state.images, true);
        updateRecentImports(state.images);
      }

      if (state.frames) {
        // hard replace all frames -> merging happens in src/javascript/tools/mergeStates/index.ts
        await updateFrames(state.frames);
      }

      if (state.frameGroups) {
        await updateFrameGroups(state.frameGroups); // updateFrameGroups merges
      }

      if (state.imageGroups) {
        await updateImageGroups(state.imageGroups, true);
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
    cancelEditFrame,
    cancelEditImages,
    cancelEditPalette,
    deleteImagesByHashes,
    dismissDialog,
    importQueueCancel,
    setDialog,
    updateFrames,
    updatePalettes,
    setPrinterBusy,
    setSyncLastUpdate,
    updateFrameGroups,
    updateImageSelection,
    updateImages,
    updateImageGroups,
    updateRecentImports,
  ]);
};
