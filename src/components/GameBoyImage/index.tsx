/* eslint-disable @next/next/no-img-element */
import Box from '@mui/material/Box';
import { maxTiles, RGBNPalette, RGBNTiles } from 'gb-image-decoder';
import { getMonochromeImageUrl, getRGBNImageUrl, Rotation } from 'gb-image-decoder';
import React, { CSSPropertiesVars, useEffect, useMemo, useState } from 'react';
import ImageLoading from '@/components/ImageLoading';
import { type Dimensions, dimensionsFromTileCount } from '@/hooks/useImageDimensions';
import { getMonochromeImageCreationParams } from '@/tools/getMonochromeImageCreationParams';

export interface GameBoyImageProps {
  palette?: string[] | RGBNPalette,
  tiles: string[] | RGBNTiles,
  imageStartLine: number,
  lockFrame?: boolean,
  invertPalette?: boolean,
  framePalette?: string[],
  invertFramePalette?: boolean,
  dimensions?: Dimensions,
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
  dimensions: dimensionsProp,
  asThumb = false,
  rotation = Rotation.DEG_0,
}: GameBoyImageProps) {

  const isRGBN = !(palette instanceof Array);
  const [src, setSrc] = useState<string | null>(null);
  const [decoderError, setDecoderError] = useState('');

  const dimensions = useMemo<Dimensions>(() => {
    if (dimensionsProp) { return dimensionsProp; }

    const tileCount = isRGBN ? maxTiles(tiles as RGBNTiles) : (tiles as string[]).length;
    return dimensionsFromTileCount(tileCount);
  }, [dimensionsProp, isRGBN, tiles]);

  useEffect(() => {
    if (!palette || !tiles) {
      return;
    }

    // ToDo: switch to requestIdleCallback once safari supports it.
    const handle = setTimeout(async () => {
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
    }, 1);

    return () => {
      clearTimeout(handle);
      // cancelIdleCallback(handle);
    };
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

  const imageStyles = useMemo((): CSSPropertiesVars => {
    const isLandscape = dimensions.width > dimensions.height;

    const pixelate = asThumb || dimensions.width > 160 || dimensions.height > 144;

    return {
      display: 'block',
      imageRendering: pixelate ? 'auto' : 'pixelated',
      margin: '0 auto',
      width: isLandscape ? '100%' : `${(1 / dimensions.aspectRatio) * 100}%`,
      aspectRatio: dimensions.aspectRatioCSS,
      maxWidth: '100%', // For Lightbox
      maxHeight: '100%', // For Lightbox
      objectFit: 'contain', // For Lightbox
    };
  }, [asThumb, dimensions]);

  if (decoderError || !src) {
    return <ImageLoading dimensions={dimensions} />;
  }

  return (
    <Box
      className="gameboy-image"
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
      }}
    >
      <img
        src={src}
        style={imageStyles}
        alt=""
      />
    </Box>
  );
}

export default GameBoyImage;
