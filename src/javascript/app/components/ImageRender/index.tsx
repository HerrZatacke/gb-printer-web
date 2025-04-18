import React from 'react';
import type { RGBNPalette } from 'gb-image-decoder';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import GameBoyImage from '../GameBoyImage';
import { useImageRender } from './useImageRender';
import type { RGBNHashes } from '../../../../types/Image';
import type { Rotation } from '../../../tools/applyRotation';

interface Props {
  hash: string,
  hashes?: RGBNHashes,
  palette: string[] | RGBNPalette,
  framePalette: string[],
  invertPalette?: boolean,
  invertFramePalette?: boolean,
  lockFrame?: boolean,
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
    />
  ) : (
    <Box
      sx={{
        width: '100%',
        paddingTop: '90%',
        height: 0,
        display: 'block',
        background: 'transparent',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress color="primary" size={40} />
      </Box>
    </Box>
  );
}

export default ImageRender;
