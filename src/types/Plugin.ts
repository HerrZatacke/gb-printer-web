import type FileSaver from 'file-saver';
import type { RGBNTiles, RGBNPalette } from 'gb-image-decoder';
import type { Image } from './Image';
import type { Palette } from './Palette';

enum ConfigParamType {
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

export interface PluginArgs<TypedStore> {
  saveAs: typeof FileSaver,
  progress: (progressValue: number) => void,
  store: TypedStore,
  collectImageData: (hash: string) => PluginImageData,
}
