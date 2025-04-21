import type FileSaver from 'file-saver';
import type { RGBNTiles, RGBNPalette, ExportFrameMode } from 'gb-image-decoder';
import type { Image } from './Image';
import type { Palette } from './Palette';
import type { PluginCompatibilityWrapper } from './PluginCompatibility';
import type { CollectImageDataFn } from '../javascript/app/contexts/plugins/functions/collectImageData';
import type { PluginFunctions } from '../javascript/app/contexts/plugins/functions/pluginContextFunctions';

export enum ConfigParamType {
  NUMBER = 'number',
  STRING = 'string',
  MULTILINE = 'multiline',
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
