import { useCallback } from 'react';
import type { ExportTypes } from '@/consts/exportTypes';
import { useStores } from '@/hooks/useStores';
import useItemsStore from '@/stores/itemsStore';
import { hashImportFrames } from '@/stores/migrations/history/0/hashFrames';
import { download } from '@/tools/download';
import { getSettings } from '@/tools/getSettings';
import { localforageFrames, localforageImages } from '@/tools/localforageInstance';
import mergeStates from '@/tools/mergeStates';
import type { JSONExport, JSONExportState, ExportableState } from '@/types/ExportState';

const mergeSettings = async (
  newSettings: JSONExport,
  mergeContents = false,
): Promise<Partial<ExportableState>> => {
  const { frames, palettes, images, imageGroups } = useItemsStore.getState();

  // add hashes to frames if they have the very old name+id format and replace the binary keys of the JSONExport
  const settings = await hashImportFrames(newSettings);

  Object.keys(settings).forEach((key: string) => {
    if (key !== 'state') {
      // import frames and images from JSON

      const exportProp: string = settings[key];

      if (key.match(/^[a-f0-9]{40,}$/gi)) {
        localforageImages.setItem(`${key}`, exportProp);
      } else if (key.startsWith('frame-')) {
        localforageFrames.setItem(`${key.split('frame-').pop()}`, exportProp);
      }
    }
  });

  return mergeStates(
    frames,
    palettes,
    images,
    imageGroups,
    settings.state || {},
    mergeContents,
  );
};

export type ImportFn = (repoContents: JSONExport) => Promise<void>;

export interface ImportExportSettings {
  downloadSettings: (what: ExportTypes, selectedFrameGroup?: string) => Promise<void>,
  jsonImport: ImportFn,
  remoteImport: (repoContents: JSONExportState) => Promise<void>,
}

export const useImportExportSettings = (): ImportExportSettings => {
  const { globalUpdate } = useStores();

  const downloadSettings = useCallback(async (what: ExportTypes, selectedFrameGroup = ''): Promise<void> => {
    const currentSettings = await getSettings(what, { selectedFrameGroup });
    const filename = what === 'frames' ? 'frames' : [what, selectedFrameGroup].filter(Boolean).join('_');

    download(null)([{
      blob: new Blob(new Array(currentSettings)),
      filename: `${filename}.json`,
    }]);
  }, []);

  const jsonImport = useCallback(async (repoContents: JSONExport): Promise<void> => {
    const update = await mergeSettings(repoContents, true);
    globalUpdate(update);
  }, [globalUpdate]);

  const remoteImport = useCallback(async (repoContents: JSONExportState): Promise<void> => {
    const update = await mergeSettings(repoContents as JSONExport, false);
    globalUpdate(update);
  }, [globalUpdate]);

  return {
    downloadSettings,
    jsonImport,
    remoteImport,
  };
};
