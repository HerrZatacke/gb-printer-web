import { Rotation, TILE_PIXEL_WIDTH, TILES_PER_LINE } from 'gb-image-decoder';
import { useMemo } from 'react';
import { useItemsStore } from '@/stores/stores';
import { isRGBNImage, reduceImagesMonochrome } from '@/tools/isRGBNImage';
import { type MonochromeImage, type RGBNImage } from '@/types/Image';

export interface Dimensions {
  width: number,
  height: number,
  aspectRatio: number,
  aspectRatioCSS: string,
}

interface UseDimensions {
  dimensions: Dimensions,
}

export const dimensionsFromTileCount = (tileCount: number, rotation = Rotation.DEG_0): Dimensions => {
  const isRotated = Boolean(rotation && [Rotation.DEG_90, Rotation.DEG_270].includes(rotation));

  const pixelHeightRaw = tileCount / TILES_PER_LINE * TILE_PIXEL_WIDTH;
  const pixelWidthRaw = TILES_PER_LINE * TILE_PIXEL_WIDTH;

  if (isRotated) {
    return {
      width: pixelHeightRaw,
      height: pixelWidthRaw,
      aspectRatio: pixelWidthRaw / pixelHeightRaw,
      aspectRatioCSS: `${pixelHeightRaw} / ${pixelWidthRaw}`,
    };
  }

  return {
    width: pixelWidthRaw,
    height: pixelHeightRaw,
    aspectRatio: pixelHeightRaw / pixelWidthRaw,
    aspectRatioCSS: `${pixelWidthRaw} / ${pixelHeightRaw}`,
  };
};

export const useImageDimensions = (hash: string): UseDimensions => {
  const { images, frames } = useItemsStore();

  const dimensions = useMemo<Dimensions>(() => {
    const image = images.find((img) => img.hash === hash) || null;

    // return default dimensions
    if (!image) { return dimensionsFromTileCount(360); }

    const frame = frames.find(({ id }) => id === image.frame) || null;

    if (frame?.lines) {
      return dimensionsFromTileCount(frame.lines, image.rotation);
    }

    let tileCount: number;
    if (isRGBNImage(image)) {
      const { hashes: { r, g, b, n } } = (image as RGBNImage);
      const channelLines = [r, g, b, n]
        .map((channelHash) => images.find((img) => img.hash === channelHash) || null)
        .reduce(reduceImagesMonochrome, [])
        .map(({ lines }) => lines);
      tileCount = Math.max(...channelLines);
    } else {
      tileCount = (image as MonochromeImage).lines;
    }

    return dimensionsFromTileCount(tileCount, image.rotation);
  }, [images, frames, hash]);


  return {
    dimensions,
  };
};
