import React from 'react';
import { RGBNPalette } from 'gb-image-decoder';
import GameBoyImage from '../GameBoyImage';
import { useImageRender } from './useImageRender';
import { RGBNHashes } from '../../../../types/Image';
import { Rotation } from '../../../tools/applyRotation';

import './index.scss';

interface Props {
  hash: string,
  hashes?: RGBNHashes,
  palette: string[] | RGBNPalette,
  invertPalette: boolean,
  lockFrame: boolean,
  frameId?: string,
  rotation?: Rotation,
}

const ImageRender = ({
  hash,
  hashes,
  frameId,
  lockFrame,
  invertPalette,
  palette,
  rotation,
}: Props) => {

  const { gbImageProps } = useImageRender({
    hash,
    hashes,
    frameId,
    lockFrame,
    invertPalette,
    palette,
    rotation,
  });

  return gbImageProps ? (
    <GameBoyImage
      lockFrame={gbImageProps.lockFrame}
      invertPalette={gbImageProps.invertPalette}
      tiles={gbImageProps.tiles}
      palette={gbImageProps.palette}
      rotation={gbImageProps.rotation}
    />
  ) : (
    <div className="image-render--loading" />
  );
};

export default ImageRender;
