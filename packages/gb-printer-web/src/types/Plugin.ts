import type FileSaver from 'file-saver';
import { type RGBNTiles, type RGBNPalette, type ExportFrameMode } from 'gb-image-decoder';
import { type Palette, type Image, type PluginConfigValues, type PluginConfigParams } from 'gb-printer-schemas';
import { type ImportFn } from '@/hooks/useImportExportSettings';
import { UsePlugins } from '@/hooks/usePlugins';
import { type UseStores } from '@/hooks/useStores';
import {
  type InteractionsState,
  type ProgressState,
} from '@/stores/stores';
import { type HandeFileImportFn } from '@/tools/getHandleFileImport';
import { type Dialog } from '@/types/Dialog';
import { type PluginCompatibilityWrapper } from '@/types/PluginCompatibility';

export interface PluginFunctions {
  importFiles: HandeFileImportFn;
  setDialog: (dialog: Dialog) => void;
  dismissDialog: () => void;
  addImages: (images: Image[]) => void;
  alert: (title: string, text: string) => void;
}

export interface GetCanvasOptions {
  scaleFactor?: number;
  palette?: Palette | RGBNPalette;
  framePalette?: Palette;
  lockFrame?: boolean;
  invertPalette?: boolean;
  invertFramePalette?: boolean;
  handleExportFrame?: ExportFrameMode;
}

export interface PluginImageData {
  getMeta: () => Promise<Image & { isRGBN: boolean }>;
  getPalette: () => Promise<Palette | RGBNPalette>;
  getTiles: () => Promise<string[] | RGBNTiles | void>;
  getCanvas: () => Promise<HTMLCanvasElement>;
}

export interface PluginClassInstance {
  name: string;
  description: string;
  config: PluginConfigValues;
  configParams: PluginConfigParams;
  withImage: (image: PluginImageData) => void;
  withSelection: (images: PluginImageData[]) => void;
  setConfig: (config: PluginConfigValues) => void;
}

export type CollectImageDataFn = (hash: string) => Promise<PluginImageData>;

export interface PluginArgs {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  saveAs: typeof FileSaver;
  progress: (progressValue: number) => void;
  setError: (err: Error) => void;
  store: PluginCompatibilityWrapper;
  collectImageData: CollectImageDataFn;
  functions: PluginFunctions;
}


declare global {
  interface Window {
    gbpwRegisterPlugin: (PluginClass: { new (
        config: PluginArgs,
        stateConfig: PluginConfigValues,
      ): PluginClassInstance; }) => void;
  }
}

export interface PluginsContext {
  runWithImage: (pluginUrl: string, imageHash: string) => Promise<void>;
  runWithImages: (pluginUrl: string, imageSelection: string[]) => Promise<void>;
  validateAndAddPlugin: (pluginUrl: string) => Promise<boolean>;
}

export type InitPluginSetupParams =
  Pick<UsePlugins, 'updatePluginState'> &
  Pick<ProgressState, 'setProgress'  | 'startProgress' | 'stopProgress'> &
  Pick<InteractionsState, 'setError'> &
  {
    collectImageData: CollectImageDataFn;
    stores: UseStores;
    importFn: ImportFn;
  }
