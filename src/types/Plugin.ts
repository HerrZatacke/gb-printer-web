import type FileSaver from 'file-saver';
import type { RGBNTiles, RGBNPalette, ExportFrameMode } from 'gb-image-decoder';
import type { ConfigParamType } from '@/consts/plugins';
import type { ImportFn } from '@/hooks/useImportExportSettings';
import type { UseStores } from '@/hooks/useStores';
import type { ItemsState } from '@/stores/itemsStore';
import type { ProgressState } from '@/stores/progressStore';
import type { HandeFileImportFn } from '@/tools/getHandleFileImport';
import type { Dialog } from '@/types/Dialog';
import type { Image } from '@/types/Image';
import type { Palette } from '@/types/Palette';
import type { PluginCompatibilityWrapper } from '@/types/PluginCompatibility';

export interface PluginFunctions {
  importFiles: HandeFileImportFn,
  setDialog: (dialog: Dialog) => void,
  dismissDialog: () => void,
  addImages: (images: Image[]) => void,
  alert: (title: string, text: string) => void,
}

export interface ConfigParam {
  label: string,
  type: ConfigParamType,
}

type PluginConfigParams = Record<string, ConfigParam>;
export type PluginConfigValues = Record<string, number | string>;

export interface GetCanvasOptions {
  scaleFactor?: number,
  palette?: Palette | RGBNPalette,
  framePalette?: Palette,
  lockFrame?: boolean,
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  handleExportFrame?: ExportFrameMode,
}

/*
* On Type-Changes, a history for migration must be kept in /src/javascript/app/stores/migrations/history/
* */
export interface Plugin {
  url: string
  config?: PluginConfigValues,
  name?: string
  description?: string
  loading?: boolean
  error?: string | false
  configParams?: PluginConfigParams,
}

export interface PluginImageData {
  getMeta: () => Promise<Image & { isRGBN: boolean }>,
  getPalette: () => Promise<Palette | RGBNPalette>,
  getTiles: () => Promise<string[] | RGBNTiles | void>,
  getCanvas: () => Promise<HTMLCanvasElement>,
}

export interface PluginClassInstance {
  name: string,
  description: string,
  config: PluginConfigValues,
  configParams: PluginConfigParams,
  withImage: (image: PluginImageData) => void,
  withSelection: (images: PluginImageData[]) => void,
  setConfig: (config: PluginConfigValues) => void,
}

export type CollectImageDataFn = (hash: string) => PluginImageData
export type GetCollectImageDataFn = (images: Image[]) => CollectImageDataFn;

export interface PluginArgs {
  saveAs: typeof FileSaver,
  progress: (progressValue: number) => void,
  store: PluginCompatibilityWrapper
  collectImageData: CollectImageDataFn,
  functions: PluginFunctions,
}


declare global {
  interface Window {
    gbpwRegisterPlugin: (PluginClass: { new (
        config: PluginArgs,
        stateConfig: PluginConfigValues,
      ): PluginClassInstance }) => void;
  }
}

export interface PluginsContext {
  runWithImage: (pluginUrl: string, imageHash: string) => Promise<void>,
  runWithImages: (pluginUrl: string, imageSelection: string[]) => Promise<void>,
  validateAndAddPlugin: (plugin: Plugin) => Promise<boolean>,
}

export type InitPluginSetupParams =
  Pick<ItemsState, 'addUpdatePluginProperties'> &
  Pick<ProgressState, 'setProgress'  | 'startProgress' | 'stopProgress'> &
  {
    collectImageData: CollectImageDataFn,
    stores: UseStores,
    importFn: ImportFn,
  }
