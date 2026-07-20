import { type Frame } from '@/types/Frame';
import { type FrameGroup } from '@/types/FrameGroup';
import { type Image } from '@/types/Image';
import { type NewSerializableImageGroup } from '@/types/ImageGroup';
import { type Palette } from '@/types/Palette';
import { type Plugin } from '@/types/Plugin';

export interface ReduxState {
  // ItemsState
  frameGroupNames: FrameGroup[];
  frames: Frame[];
  images: Image[];
  imageGroups: NewSerializableImageGroup[];
  palettes: Palette[];
  plugins: Plugin[];
}
