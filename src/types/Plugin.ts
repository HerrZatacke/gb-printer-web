import type FileSaver from 'file-saver';
import { type RGBNTiles, type RGBNPalette, type ExportFrameMode } from 'gb-image-decoder';
import z from 'zod';
import { ConfigParamType } from '@/consts/plugins';
import { type ImportFn } from '@/hooks/useImportExportSettings';
import { type UseStores } from '@/hooks/useStores';
import {
  type InteractionsState,
  type ItemsState,
  type ProgressState,
} from '@/stores/stores';
import { type HandeFileImportFn } from '@/tools/getHandleFileImport';
import { type Dialog } from '@/types/Dialog';
import { Frame } from '@/types/Frame';
import { type Image } from '@/types/Image';
import { type Palette } from '@/types/Palette';
import { type PluginCompatibilityWrapper } from '@/types/PluginCompatibility';

export interface PluginFunctions {
  importFiles: HandeFileImportFn;
  setDialog: (dialog: Dialog) => void;
  dismissDialog: () => void;
  addImages: (images: Image[]) => void;
  alert: (title: string, text: string) => void;
}

export const ConfigParamSchema = z.object({
  label: z.string(),
  type: z.enum(ConfigParamType),
});

export type ConfigParam = z.infer<typeof ConfigParamSchema>;

export const PluginConfigParamsSchema = z.partialRecord(
  z.string(),
  ConfigParamSchema,
).default({});
export type PluginConfigParams = z.infer<typeof PluginConfigParamsSchema>;

export const PluginConfigValuesSchema = z.partialRecord(
  z.string(),
  z.union([z.number(), z.string()],
)).default({});
export type PluginConfigValues = z.infer<typeof PluginConfigValuesSchema>;

export const PluginSchema = z.object({
  url: z.string(),
  config: PluginConfigValuesSchema.optional(),
  name: z.string().prefault(''),
  description: z.string().prefault(''),
  loading: z.boolean().optional(),
  error: z.union([z.string(), z.literal(false)]).optional(),
  configParams: PluginConfigParamsSchema.optional(),
});

export type Plugin = z.infer<typeof PluginSchema>;

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

export type CollectImageDataFn = (hash: string) => PluginImageData
export type GetCollectImageDataFn = (images: Image[], palettes: Palette[], frames: Frame[]) => CollectImageDataFn;

export interface PluginArgs {
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
  Pick<ItemsState, 'addUpdatePluginProperties'> &
  Pick<ProgressState, 'setProgress'  | 'startProgress' | 'stopProgress'> &
  Pick<InteractionsState, 'setError'> &
  {
    collectImageData: CollectImageDataFn;
    stores: UseStores;
    importFn: ImportFn;
  }
