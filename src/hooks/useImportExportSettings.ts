import { useCallback } from 'react';
import { type ExportTypes } from '@/consts/exportTypes';
import { getQueryClient } from '@/contexts/QueryClient';
import { useStores } from '@/hooks/useStores';
import { updateBinaryFramesAction } from '@/stores/items/queries/binaryFrames';
import { updateBinaryImagesAction } from '@/stores/items/queries/binaryImages';
import { framesListQueryOptions } from '@/stores/items/queries/frames';
import { imageGroupsListQueryOptions } from '@/stores/items/queries/imageGroups';
import { imagesListQueryOptions } from '@/stores/items/queries/images';
import { palettesListQueryOptions } from '@/stores/items/queries/palettes';
import { download } from '@/tools/download';
import { getSettings } from '@/tools/getSettings';
import mergeStates from '@/tools/mergeStates';
import { type BinaryStoreItem } from '@/types/BinaryStoreItem';
import {
  type JSONExport,
  type ExportableState,
  JSONExportSchema,
} from '@/types/ExportState';

const mergeSettings = async (
  settings: JSONExport,
  isFromJsonImport: boolean,
): Promise<Partial<ExportableState>> => {
  const queryClient = getQueryClient();

  const [
    { items: images },
    { items: palettes },
    { items: frames },
    { items: imageGroups },
  ] = await Promise.all([
    queryClient.fetchQuery(imagesListQueryOptions()),
    queryClient.fetchQuery(palettesListQueryOptions()),
    queryClient.fetchQuery(framesListQueryOptions()),
    queryClient.fetchQuery(imageGroupsListQueryOptions()),
  ]);

  const binaryImageEntries: BinaryStoreItem[] = [];
  const binaryFrameEntries: BinaryStoreItem[] = [];

  Object.keys(settings).forEach((key: string) => {
    if (key === 'state') {
      return;
    }

    const exportProp: string = settings[key];

    if (key.match(/^[a-f0-9]{40,}$/gi)) {
      binaryImageEntries.push({ hash: key, data: exportProp });
    } else if (key.startsWith('frame-')) {
      binaryFrameEntries.push({ hash: `${key.split('frame-').pop()}`, data: exportProp });
    }
  });

  if (binaryImageEntries.length > 0) {
    await updateBinaryImagesAction(queryClient, binaryImageEntries);
  }

  if (binaryFrameEntries.length > 0) {
    await updateBinaryFramesAction(queryClient, binaryFrameEntries);
  }

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
  remoteImport: (repoContents: JSONExport) => Promise<void>;
}

export const useImportExportSettings = (): ImportExportSettings => {
  const { globalUpdate } = useStores();

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

  const jsonImport = useCallback(async (repoContentsRaw: JSONExport): Promise<void> => {
    const repoContents = JSONExportSchema.parse(repoContentsRaw);
    const update = await mergeSettings(repoContents, true);
    await globalUpdate(update);
  }, [globalUpdate]);

  const remoteImport = useCallback(async (repoContentsRaw: JSONExport): Promise<void> => {
    const repoContents = JSONExportSchema.parse(repoContentsRaw);
    const update = await mergeSettings(repoContents, false);
    await globalUpdate(update);
  }, [globalUpdate]);

  return {
    getSettingsFile,
    downloadSettings,
    jsonImport,
    remoteImport,
  };
};
