import React, { useEffect, useMemo, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import type { RGBNPalette, RGBNTiles } from 'gb-image-decoder';
import { Decoder, maxTiles, RGBNDecoder } from 'gb-image-decoder';
import { applyRotation, Rotation } from '../../../tools/applyRotation';
import { getDecoderUpdateParams } from '../../../tools/getDecoderUpdateParams';

export interface GameBoyImageProps {
  palette?: string[] | RGBNPalette,
  tiles: string[] | RGBNTiles,
  imageStartLine: number,
  lockFrame?: boolean,
  invertPalette?: boolean,
  framePalette?: string[],
  invertFramePalette?: boolean,
  asThumb?: boolean,
  rotation?: Rotation,
}

function GameBoyImage({
  palette,
  tiles,
  imageStartLine,
  lockFrame,
  invertPalette,
  framePalette,
  invertFramePalette,
  asThumb = false,
  rotation = Rotation.DEG_0,
}: GameBoyImageProps) {

  const isRGBN = !(palette instanceof Array);
  const canvas = useRef(null);
  const [decoderError, setDecoderError] = useState('');

  useEffect(() => {
    if (!palette || !tiles) {
      return;
    }

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 160;
    tempCanvas.height = 144;

    try {
      if (isRGBN) {
        const decoder = new RGBNDecoder();
        if (tiles) {
          decoder.update({
            canvas: tempCanvas,
            tiles: tiles as RGBNTiles,
            palette,
            lockFrame,
          });
        }
      } else {
        const decoder = new Decoder();
        if ((tiles as string[] | undefined)?.length) {
          const updateParams = getDecoderUpdateParams({
            palette,
            framePalette,
            invertPalette,
            invertFramePalette,
          });

          decoder.update({
            canvas: tempCanvas,
            tiles: tiles as string[],
            ...updateParams,
            imageStartLine,
          });
        }
      }

      if (canvas.current) {
        applyRotation(tempCanvas, canvas.current, rotation || Rotation.DEG_0);
      }

      setDecoderError('');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setDecoderError(error.message);
      }
    }

  }, [
    tiles,
    palette,
    lockFrame,
    invertPalette,
    rotation,
    isRGBN,
    imageStartLine,
    framePalette,
    invertFramePalette,
  ]);

  const styles = useMemo(() => {
    const isRotated = rotation === Rotation.DEG_90 || rotation === Rotation.DEG_270;
    const isMinSize = (isRGBN ? maxTiles(tiles as RGBNTiles) : (tiles as string[]).length) <= 360;
    const minRot = isRotated && isMinSize;

    return {
      display: 'flex', // For LightBox
      width: '100%', // For LightBox
      height: '100%', // For LightBox
      canvas: {
        display: 'block',
        imageRendering: asThumb ? 'auto' : 'pixelated',
        margin: minRot ? '0 5%' : 0,
        width: minRot ? '90%' : '100%',
        maxWidth: '100%', // For Lightbox
        maxHeight: '100%', // For Lightbox
        objectFit: 'contain', // For Lightbox
      },
    };
  }, [asThumb, isRGBN, rotation, tiles]);

  return (
    <Box sx={styles}>
      {!decoderError && (
        <canvas
          width={160}
          ref={canvas}
        />
      )}
    </Box>
  );
}

export default GameBoyImage;
