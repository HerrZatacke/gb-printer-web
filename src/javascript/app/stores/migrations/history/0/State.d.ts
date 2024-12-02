import type { FrameGroup } from '../../../../../../types/FrameGroup';
import type { Frame } from '../../../../../../types/Frame';
import type { Image } from '../../../../../../types/Image';
import type { SerializableImageGroup } from '../../../../../../types/ImageGroup';
import type { Palette } from '../../../../../../types/Palette';
import type { Plugin } from '../../../../../../types/Plugin';

export interface ReduxState {
  frameGroupNames: FrameGroup[],
  frames: Frame[],
  images: Image[],
  imageGroups: SerializableImageGroup[],
  palettes: Palette[],
  plugins: Plugin[],
}
