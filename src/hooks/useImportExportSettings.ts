import { useCallback } from 'react';
import { type ExportTypes } from '@/consts/exportTypes';
import { useFrames } from '@/hooks/useFrames';
import { usePalettes } from '@/hooks/usePalettes';
import { useStores } from '@/hooks/useStores';
import { type ItemsState, useItemsStore } from '@/stores/stores';
import { download } from '@/tools/download';
import { getSettings } from '@/tools/getSettings';
import { localforageFrames, localforageImages } from '@/tools/localforageInstance';
import mergeStates from '@/tools/mergeStates';
import { type JSONExport, type JSONExportState, type ExportableState } from '@/types/ExportState';
import { type Frame } from '@/types/Frame';
import { type Palette } from '@/types/Palette';

const mergeSettings = async (
  settings: JSONExport,
  itemsState: ItemsState,
  palettes: Palette[],
  frames: Frame[],
  isFromJsonImport: boolean,
): Promise<Partial<ExportableState>> => {
  const { images, imageGroups } = itemsState;

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

  // ToDo: check for cases which need to "purge" the target table/store on update
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
  const { frames } = useFrames({ list: true });

  const getSettingsFile = useCallback(async (what: ExportTypes, selectedFrameGroup = ''): Promise<File> => {
    const currentSettings = await getSettings(what, { selectedFrameGroup });
    const filename = what === 'frames' ? 'frames' : [what, selectedFrameGroup].filter(Boolean).join('_');

    return new File(new Array(currentSettings), `${filename}.json`, { type: 'application/json' });
  }, []);

  const downloadSettings = useCallback(async (what: ExportTypes, selectedFrameGroup = ''): Promise<void> => {
    const settingsFile = await getSettingsFile(what, selectedFrameGroup);

    download(null)([{
      blob: settingsFile,
      filename: settingsFile.name,
    }]);
  }, [getSettingsFile]);

  const jsonImport = useCallback(async (repoContents: JSONExport): Promise<void> => {
    const update = await mergeSettings(repoContents, itemsState, palettes, frames, true);
    globalUpdate(update);
  }, [globalUpdate, itemsState, palettes, frames]);

  const remoteImport = useCallback(async (repoContents: JSONExportState): Promise<void> => {
    const update = await mergeSettings(repoContents as JSONExport, itemsState, palettes, frames, false);
    globalUpdate(update);
  }, [globalUpdate, itemsState, palettes, frames]);

  return {
    getSettingsFile,
    downloadSettings,
    jsonImport,
    remoteImport,
  };
};
