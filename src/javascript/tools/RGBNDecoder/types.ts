import Decoder from '../Decoder';

export enum ChannelKey {
  R = 'r',
  G = 'g',
  B = 'b',
  N = 'n',
}

export interface Channel {
  key: ChannelKey,
  tiles?: string[],
  decoder: Decoder,
  canvas: HTMLCanvasElement,
}

export type RGBNTiles = Partial<Record<ChannelKey, string[]>>;

export type Channels = Record<ChannelKey, Channel>;

export type SourceCanvases = Partial<Record<ChannelKey, HTMLCanvasElement>>;
