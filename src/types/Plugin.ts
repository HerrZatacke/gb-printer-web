import { MiddlewareAPI } from 'redux';
import FileSaver from 'file-saver';
import { Image, RGBNPalette } from './Image';
import { Palette } from './Palette';
import { RGBNTile } from '../javascript/tools/Decoder/types';

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
  getTiles: () => Promise<string[] | RGBNTile[] | void>,
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
  store: MiddlewareAPI,
  collectImageData: (hash: string) => PluginImageData,
}
