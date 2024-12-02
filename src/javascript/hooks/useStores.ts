import { useMemo } from 'react';
import type { Image } from '../../types/Image';
import useDialogsStore from '../app/stores/dialogsStore';
import useEditStore from '../app/stores/editStore';
import useFiltersStore, { ImageSelectionMode } from '../app/stores/filtersStore';
import useImportsStore from '../app/stores/importsStore';
import useInteractionsStore from '../app/stores/interactionsStore';
import useItemsStore from '../app/stores/itemsStore';
import useStoragesStore from '../app/stores/storagesStore';
import type { Values } from '../app/stores/itemsStore';
import type { Dialog } from '../../types/Dialog';
import type { ExportableState } from '../../types/ExportState';

export interface UseStores {
  addImages: (images: Image[]) => void,
  deleteImages: (hashes: string[]) => void,
  dismissDialog: (index: number) => void,
  globalUpdate: (state: Partial<ExportableState>) => void,
  importQueueCancel: () => void,
  setDialog: (dialog: Dialog) => void,
  updateImageHash: (oldHash: string, image: Image) => void,
  updateImages: (images: Image[]) => void,
  updateLastSyncLocalNow: () => void,
}

export const useStores = (): UseStores => {
  const { dismissDialog, setDialog } = useDialogsStore();
  const { cancelEditFrame, cancelEditImages, cancelEditPalette } = useEditStore();
  const { updateRecentImports, updateImageSelection } = useFiltersStore();
  const { importQueueCancel } = useImportsStore();
  const { setProgress, setPrinterBusy } = useInteractionsStore();
  const {
    addFrames,
    addImages,
    addPalettes,
    deleteImages,
    setImageGroups,
    updateFrameGroups,
    updateImageHash,
    updateImages,
  } = useItemsStore();
  const { setSyncLastUpdate } = useStoragesStore();

  return useMemo(() => {
    const updateLastSyncLocalNow = () => setSyncLastUpdate('local', Math.floor((new Date()).getTime() / 1000));

    const combinedImportQueueCancel = () => {
      setProgress('printer', 0);
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

    const combinedUpdateImageHash = (oldHash: string, image: Image) => {
      cancelEditImages();
      updateLastSyncLocalNow();
      updateImageHash(oldHash, image);
    };

    const combinedDeleteImages = (hashes: string[]) => {
      deleteImages(hashes);
      updateImageSelection(ImageSelectionMode.REMOVE, hashes);
      dismissDialog(0);
      updateLastSyncLocalNow();
    };

    const combinedGlobalUpdate = (state: Partial<Values>) => {
      cancelEditFrame();
      cancelEditPalette();
      cancelEditImages();
      updateLastSyncLocalNow();

      if (state.palettes) {
        addPalettes(state.palettes);
      }

      if (state.images) {
        updateRecentImports(state.images);
      }

      if (state.frames) {
        addFrames(state.frames);
      }

      if (state.frameGroups) {
        updateFrameGroups(state.frameGroups);
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
      updateImageHash: combinedUpdateImageHash,
      updateImages: combinedUpdateImages,
      updateLastSyncLocalNow,
    });
  }, [
    addFrames,
    addImages,
    addPalettes,
    cancelEditFrame,
    cancelEditImages,
    cancelEditPalette,
    deleteImages,
    dismissDialog,
    importQueueCancel,
    setDialog,
    setImageGroups,
    setPrinterBusy,
    setProgress,
    setSyncLastUpdate,
    updateFrameGroups,
    updateImageHash,
    updateImageSelection,
    updateImages,
    updateRecentImports,
  ]);
};
