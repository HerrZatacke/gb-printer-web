import React from 'react';
import type { RGBNPalette, Rotation } from 'gb-image-decoder';
import GameBoyImage from '../GameBoyImage';
import ImageLoading from '../ImageLoading';
import { useImageRender } from './useImageRender';
import type { RGBNHashes } from '../../../../types/Image';

interface Props {
  hash: string,
  hashes?: RGBNHashes,
  palette: string[] | RGBNPalette,
  framePalette: string[],
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  lockFrame?: boolean,
  asThumb?: boolean,
  frameId?: string,
  rotation?: Rotation,
}

function ImageRender({
  hash,
  hashes,
  frameId,
  lockFrame,
  invertPalette,
  invertFramePalette,
  palette,
  framePalette,
  rotation,
  asThumb,
}: Props) {

  const { gbImageProps } = useImageRender({
    hash,
    hashes,
    frameId,
    lockFrame,
    invertPalette,
    invertFramePalette,
    palette,
    framePalette,
    rotation,
  });

  return gbImageProps ? (
    <GameBoyImage
      lockFrame={gbImageProps.lockFrame}
      invertPalette={gbImageProps.invertPalette}
      invertFramePalette={gbImageProps.invertFramePalette}
      tiles={gbImageProps.tiles}
      palette={gbImageProps.palette}
      framePalette={gbImageProps.framePalette}
      imageStartLine={gbImageProps.imageStartLine}
      rotation={gbImageProps.rotation}
      asThumb={asThumb}
    />
  ) : (
    <ImageLoading />
  );
}

export default ImageRender;
