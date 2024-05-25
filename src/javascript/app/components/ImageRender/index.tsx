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

        if (loadedTiles) {
          setTiles(loadedTiles);
        }
      });

    return () => {
      aborted = true;
    };
  }, [loadImageTiles, hash, hashes, frameId]);

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
