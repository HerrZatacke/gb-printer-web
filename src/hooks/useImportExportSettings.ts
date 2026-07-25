import { useCallback } from 'react';
import { type ExportTypes } from '@/consts/exportTypes';
import { getQueryClient } from '@/contexts/QueryClient';
import { useFrames } from '@/hooks/useFrames';
import { useImageGroups } from '@/hooks/useImageGroups';
import { useImages } from '@/hooks/useImages';
import { usePalettes } from '@/hooks/usePalettes';
import { useStores } from '@/hooks/useStores';
import { updateBinaryFramesAction } from '@/stores/queries/binaryFrames';
import { updateBinaryImagesAction } from '@/stores/queries/binaryImages';
import { download } from '@/tools/download';
import { getSettings } from '@/tools/getSettings';
import mergeStates from '@/tools/mergeStates';
import { type BinaryStoreItem } from '@/types/BinaryStoreItem';
import { type JSONExport, type JSONExportState, type ExportableState } from '@/types/ExportState';
import { type Frame } from '@/types/Frame';
import { Image } from '@/types/Image';
import { SerializableImageGroup } from '@/types/ImageGroup';
import { type Palette } from '@/types/Palette';

const mergeSettings = async (
  settings: JSONExport,
  images: Image[],
  imageGroups: SerializableImageGroup[],
  palettes: Palette[],
  frames: Frame[],
  isFromJsonImport: boolean,
): Promise<Partial<ExportableState>> => {
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

  const queryClient = getQueryClient();

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
  remoteImport: (repoContents: JSONExportState) => Promise<void>;
}

export const useImportExportSettings = (): ImportExportSettings => {
  const { globalUpdate } = useStores();
  const { palettes } = usePalettes({ list: true });
  const { frames } = useFrames({ list: true });
  const { images } = useImages({ list: true });
  const { imageGroups } = useImageGroups({ list: true });

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
    const update = await mergeSettings(repoContents, images, imageGroups, palettes, frames, true);
    await globalUpdate(update);
  }, [globalUpdate, images, imageGroups, palettes, frames]);

  const remoteImport = useCallback(async (repoContents: JSONExportState): Promise<void> => {
    const update = await mergeSettings(repoContents as JSONExport, images, imageGroups, palettes, frames, false);
    await globalUpdate(update);
  }, [globalUpdate, images, imageGroups, palettes, frames]);

  return {
    getSettingsFile,
    downloadSettings,
    jsonImport,
    remoteImport,
  };
};
