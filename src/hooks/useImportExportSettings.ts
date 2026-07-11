import { useCallback } from 'react';
import { type ExportTypes } from '@/consts/exportTypes';
import { usePalettes } from '@/hooks/usePalettes';
import { useStores } from '@/hooks/useStores';
import { hashImportFrames } from '@/stores/migrations/history/0/hashFrames';
import { type ItemsState, useItemsStore } from '@/stores/stores';
import { download } from '@/tools/download';
import { getSettings } from '@/tools/getSettings';
import { localforageFrames, localforageImages } from '@/tools/localforageInstance';
import mergeStates from '@/tools/mergeStates';
import { type JSONExport, type JSONExportState, type ExportableState } from '@/types/ExportState';
import { Palette } from '@/types/Palette';

const mergeSettings = async (
  newSettings: JSONExport,
  itemsState: ItemsState,
  palettes: Palette[],
  isFromJsonImport: boolean,
): Promise<Partial<ExportableState>> => {
  const { frames, images, imageGroups } = itemsState;

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
    isFromJsonImport,
  );
};

export type ImportFn = (repoContents: JSONExport) => Promise<void>;

export interface ImportExportSettings {
  downloadSettings: (what: ExportTypes, selectedFrameGroup?: string) => Promise<void>;
  getSettingsFile: (what: ExportTypes, selectedFrameGroup?: string) => Promise<File>;
  jsonImport: ImportFn;
  remoteImport: (repoContents: JSONExportState) => Promise<void>;
}

export const useImportExportSettings = (): ImportExportSettings => {
  const { globalUpdate } = useStores();
  const itemsState = useItemsStore();
  const { palettes } = usePalettes({ list: true });

  const getSettingsFile = useCallback(async (what: ExportTypes, selectedFrameGroup = ''): Promise<File> => {
    const currentSettings = await getSettings(what, itemsState, { selectedFrameGroup });
    const filename = what === 'frames' ? 'frames' : [what, selectedFrameGroup].filter(Boolean).join('_');

    return new File(new Array(currentSettings), `${filename}.json`, { type: 'application/json' });
  }, [itemsState]);

  const downloadSettings = useCallback(async (what: ExportTypes, selectedFrameGroup = ''): Promise<void> => {
    const settingsFile = await getSettingsFile(what, selectedFrameGroup);

    download(null)([{
      blob: settingsFile,
      filename: settingsFile.name,
    }]);
  }, [getSettingsFile]);

  const jsonImport = useCallback(async (repoContents: JSONExport): Promise<void> => {
    const update = await mergeSettings(repoContents, itemsState, palettes, true);
    globalUpdate(update);
  }, [globalUpdate, itemsState, palettes]);

  const remoteImport = useCallback(async (repoContents: JSONExportState): Promise<void> => {
    const update = await mergeSettings(repoContents as JSONExport, itemsState, palettes, false);
    globalUpdate(update);
  }, [globalUpdate, itemsState, palettes]);

  return {
    getSettingsFile,
    downloadSettings,
    jsonImport,
    remoteImport,
  };
};
