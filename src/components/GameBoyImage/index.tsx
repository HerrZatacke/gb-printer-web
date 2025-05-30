import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import type { RGBNPalette, RGBNTiles } from 'gb-image-decoder';
import { getMonochromeImageUrl, getRGBNImageUrl, maxTiles, Rotation } from 'gb-image-decoder';
import { getMonochromeImageCreationParams } from '../../../tools/getMonochromeImageCreationParams';

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
  const [src, setSrc] = useState<string | null>(null);
  const [decoderError, setDecoderError] = useState('');

  useEffect(() => {
    if (!palette || !tiles) {
      return;
    }

    (async () => {
      try {
        if (isRGBN) {
          setSrc(await getRGBNImageUrl({
            tiles: tiles as RGBNTiles,
            palette,
            lockFrame: lockFrame || false,
            rotation,
          }));
        } else if ((tiles as string[] | undefined)?.length) {
          setSrc(await getMonochromeImageUrl({
            tiles: tiles as string[],
            imageStartLine,
            rotation,
            ...getMonochromeImageCreationParams({
              imagePalette: palette,
              framePalette,
              invertPalette,
              invertFramePalette,
            }),
          }));
        }

        setDecoderError('');
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          setDecoderError(error.message);
        }
      }
    })();
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

  const imageStyles = useMemo(() => {
    const isRotated = rotation === Rotation.DEG_90 || rotation === Rotation.DEG_270;
    const isMinSize = (isRGBN ? maxTiles(tiles as RGBNTiles) : (tiles as string[]).length) <= 360;
    const minRot = isRotated && isMinSize;

    return {
      display: 'block',
      imageRendering: asThumb ? 'auto' : 'pixelated',
      margin: minRot ? '0 5%' : 0,
      width: minRot ? '90%' : '100%',
      maxWidth: '100%', // For Lightbox
      maxHeight: '100%', // For Lightbox
      objectFit: 'contain', // For Lightbox
    };
  }, [asThumb, isRGBN, rotation, tiles]);

  return (
    <Box
      className="gameboy-image"
      sx={{
        display: 'flex', // For LightBox
        width: '100%', // For LightBox
        height: '100%', // For LightBox
      }}
    >
      {!decoderError && src && (
        <Box
          component="img"
          width={160}
          src={src}
          sx={imageStyles}
          alt=""
        />
      )}
    </Box>
  );
}

export default GameBoyImage;
