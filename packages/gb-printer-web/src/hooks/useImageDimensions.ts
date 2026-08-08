import { useQueryClient } from '@tanstack/react-query';
import { Rotation, TILE_PIXEL_WIDTH, TILES_PER_LINE } from 'gb-image-decoder';
import { type MonochromeImage, type RGBNImage } from 'gb-printer-schemas';
import { useEffect, useMemo, useState } from 'react';
import { framesByIdsQueryOptions } from '@/stores/items/queries/frames';
import { imageByHashQueryOptions, imagesByHashesQueryOptions } from '@/stores/items/queries/images';
import { isRGBNImage } from '@/tools/isRGBNImage';

export interface Dimensions {
  width: number;
  height: number;
  aspectRatio: number;
  aspectRatioCSS: string;
}

interface UseDimensions {
  dimensions: Dimensions;
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
  const queryClient = useQueryClient();

  const [lines, setLines] = useState<number>(360);
  const [rotation, setRotation] = useState<Rotation>(Rotation.DEG_0);

  useEffect(() => {
    let cancelled = false;

    queryClient.fetchQuery(imageByHashQueryOptions(hash))
      .then(async (image) => {
        if (!image || cancelled) {
          return;
        }

        const imageRotation = image.rotation || Rotation.DEG_0;

        if (image.frame) {
          const { items: [frame] } = await queryClient.fetchQuery(framesByIdsQueryOptions([image.frame]));
          if (frame?.lines) {
            setLines(frame.lines);
            setRotation(imageRotation);
          }
        }

        let tileCount = 360;

        if (isRGBNImage(image)) {
          if (cancelled) {
            return;
          }

          const { hashes: { r, g, b, n } } = (image as RGBNImage);
          const channelHashes = [r, g, b, n].filter((s):s is string => Boolean(s));
          const { items: channelImages } = await queryClient.fetchQuery(imagesByHashesQueryOptions(channelHashes));
          const channelLines = (channelImages as MonochromeImage[]).map((img) => img.lines || 360);

          tileCount = Math.max(...channelLines);
        } else {
          tileCount = (image as MonochromeImage).lines;
        }

        if (!cancelled) {
          setLines(tileCount);
          setRotation(imageRotation);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [hash, queryClient]);


  const dimensions = useMemo(() => dimensionsFromTileCount(lines, rotation), [lines, rotation]);

  return {
    dimensions,
  };
};
