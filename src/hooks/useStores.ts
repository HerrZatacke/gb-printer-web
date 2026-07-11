import { useLayoutEffect, useMemo, useRef } from 'react';
import { usePalettes } from '@/hooks/usePalettes';
import {
  ImageSelectionMode, type ItemsState,
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

export interface SyncToolData {
  itemsState: ItemsState;
}

export interface UseStores {
  addImages: (images: Image[]) => void;
  deleteImages: (hashes: string[]) => void;
  dismissDialog: (index: number) => void;
  globalUpdate: (state: Partial<ExportableState>) => void;
  importQueueCancel: () => void;
  setDialog: (dialog: Dialog) => void;
  updateImages: (images: Image[]) => void;
  updateLastSyncLocalNow: () => void;
  getSyncToolData: () => SyncToolData;
}

export const useStores = (): UseStores => {
  const { dismissDialog, setDialog } = useDialogsStore();
  const { cancelEditFrame, cancelEditImages, cancelEditPalette } = useEditStore();
  const { updateRecentImports, updateImageSelection } = useFiltersStore();
  const { importQueueCancel } = useImportsStore();
  const { setPrinterBusy } = useInteractionsStore();
  const itemsState = useItemsStore();

  // ToDo: remove once better sync is available
  // Update refs for github and dropbox exports
  const itemsStateRef = useRef(itemsState);

  useLayoutEffect(() => {
    itemsStateRef.current = itemsState;
  }, [itemsState]);

  const {
    addImages,
    deleteImages,
    setImageGroups,
    updateFrameGroups,
    updateImages,
    setFrames,
    setImages,
  } = itemsState;

  const { updatePalettes } = usePalettes({});

  const { setSyncLastUpdate } = useStoragesStore();

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

      if (state.frames) {
        // hard replace all frames -> merging happens in src/javascript/tools/mergeStates/index.ts
        setFrames(state.frames);
      }

      if (state.frameGroups) {
        updateFrameGroups(state.frameGroups); // updateFrameGroups merges
      }

      if (state.imageGroups) {
        setImageGroups(state.imageGroups);
      }
    };

    const getSyncToolData = (): SyncToolData => {
      return {
        itemsState: itemsStateRef.current,
      };
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
      getSyncToolData,
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
    setFrames,
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
