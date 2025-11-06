import { useCallback, useEffect, useMemo } from 'react';
import useTracking from '@/contexts/TrackingContext';
import { useImportExportSettings } from '@/hooks/useImportExportSettings';
import useInteractionsStore from '@/stores/interactionsStore';
import { concatImportResults } from '@/tools/concatImportResults';
import getHandleFileImport from '@/tools/getHandleFileImport';

let dragoverTimeout: number;
let dragging = false;

const useFileDrop = () => {
  const { setDragover, setError } = useInteractionsStore();
  const { sendEvent } = useTracking();
  const { jsonImport } = useImportExportSettings();
  const handleFileImport = useMemo(() => (getHandleFileImport(jsonImport)), [jsonImport]);

  const initFileDrop = useCallback(() => {

    const dragListener = (ev: DragEvent) => {
      ev.preventDefault();

      if (!dragging) {
        setDragover(true);
      }

      window.clearTimeout(dragoverTimeout);

      dragging = true;

      dragoverTimeout = window.setTimeout(() => {
        dragging = false;
        setDragover(false);
      }, 250);
    };

    const dropListener = async (ev: Event) => {
      ev.preventDefault();
      let files: File[];
      const items = ((ev as DragEvent).dataTransfer as DataTransfer).items as DataTransferItemList;

      if (items) {
        files = ([...items] as DataTransferItem[])
          .reduce((acc: File[], item: DataTransferItem): File[] => {
            if (item.kind === 'file') {
              const file = item.getAsFile();
              return file ? [...acc, file] : acc;
            }

            return acc;
          }, []);
      } else {
        const fileList = ((ev as DragEvent).dataTransfer as DataTransfer).files as FileList;
        files = [...fileList];
      }

      try {
        const importResults = await handleFileImport(files);
        sendEvent('importQueue', concatImportResults(importResults, 'fileDrop'));
      } catch (error) {
        setError(error as Error);
      }
    };


    const root = document.querySelector('body');
    if (!root) {
      throw new Error('dafuq?');
    }

    // detect start and end of dragover as there is no native dragend ecent for files
    root.addEventListener('dragover', dragListener);
    root.addEventListener('drop', dropListener);

    return () => {
      root.removeEventListener('dragover', dragListener);
      root.removeEventListener('drop', dropListener);
    };

  }, [handleFileImport, sendEvent, setDragover, setError]);

  useEffect(initFileDrop, [initFileDrop]);
};

export default useFileDrop;
