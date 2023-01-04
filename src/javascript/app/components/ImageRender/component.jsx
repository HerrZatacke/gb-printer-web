import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';

const ImageRender = ({
  hash,
  hashes,
  frameId,
  lockFrame,
  invertPalette,
  palette,
  loadImageTiles,
  reportTileCount,
  recover,
  rotation,
}) => {
  const [tiles, setTiles] = useState(null);

  useEffect(() => {
    let aborted = false;

    // setTiles(null); // no need to clear before update?
    loadImageTiles({ hash, frame: frameId, hashes }, false, recover)
      .then((loadedTiles) => {
        if (aborted) {
          return;
        }

        reportTileCount(loadedTiles.length);
        setTiles(loadedTiles);
      });

    return () => {
      aborted = true;
    };
  }, [loadImageTiles, reportTileCount, hash, hashes, frameId, recover]);

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

ImageRender.propTypes = {
  loadImageTiles: PropTypes.func.isRequired,
  reportTileCount: PropTypes.func,
  hash: PropTypes.string.isRequired,
  hashes: PropTypes.object,
  palette: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]).isRequired,
  invertPalette: PropTypes.bool.isRequired,
  frameId: PropTypes.string,
  lockFrame: PropTypes.bool.isRequired,
  recover: PropTypes.func.isRequired,
  rotation: PropTypes.number,
};

ImageRender.defaultProps = {
  hashes: null,
  frameId: null,
  reportTileCount: () => {},
  rotation: null,
};

export default ImageRender;
