import React, { useEffect, useState } from 'react';
import { RGBNPalette, RGBNTiles } from 'gb-image-decoder';
import GameBoyImage from '../GameBoyImage';
import { useImageRender } from './useImageRender';

import './index.scss';
import { RGBNHashes } from '../../../../types/Image';

interface Props {
  hash: string,
  hashes?: RGBNHashes,
  palette: string[] | RGBNPalette,
  invertPalette: boolean,
  lockFrame: boolean,
  frameId?: string,
  rotation?: number,
  reportTileCount?: (count: number) => void, // ToDo: remove...
}

const ImageRender = ({
  hash,
  hashes,
  frameId,
  lockFrame,
  invertPalette,
  palette,
  reportTileCount,
  rotation,
}: Props) => {
  const [tiles, setTiles] = useState<string[] | RGBNTiles>();

  const { loadImageTiles } = useImageRender(hash);

  useEffect(() => {
    let aborted = false;

    // setTiles(null); // no need to clear before update?
    loadImageTiles({ hash, frame: frameId || '', hashes }, false)
      .then((loadedTiles) => {
        if (aborted) {
          return;
        }

        if (reportTileCount) {
          if (loadedTiles) {
            reportTileCount(
              (loadedTiles as string[])?.length ||
              (loadedTiles as RGBNTiles).r?.length ||
              (loadedTiles as RGBNTiles).g?.length ||
              (loadedTiles as RGBNTiles).b?.length ||
              (loadedTiles as RGBNTiles).n?.length || 0,
            );
          } else {
            reportTileCount(0);
          }
        }

        if (loadedTiles) {
          setTiles(loadedTiles);
        }
      });

    return () => {
      aborted = true;
    };
  }, [loadImageTiles, reportTileCount, hash, hashes, frameId]);

  return tiles ? (
    <GameBoyImage
      lockFrame={lockFrame}
      invertPalette={invertPalette}
      tiles={tiles}
      palette={palette}
      rotation={rotation}
    />
  ) : (
    <div className="image-render--loading" />
  );
};

export default ImageRender;
