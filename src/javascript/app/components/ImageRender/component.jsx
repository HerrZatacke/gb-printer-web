import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';

const ImageRender = ({
  hash,
  hashes,
  frame,
  lockFrame,
  invertPalette,
  palette,
  loadImageTiles,
  reportTileCount,
}) => {
  const [tiles, setTiles] = useState(null);
  useEffect(() => {
    setTiles(null);
    loadImageTiles({ hash, frame, hashes })
      .then((loadedTiles) => {
        reportTileCount(loadedTiles.length);
        setTiles(loadedTiles);
      });
  }, [reportTileCount, loadImageTiles, hash, hashes, frame]);

  return tiles ? (
    <GameBoyImage
      lockFrame={lockFrame}
      invertPalette={invertPalette}
      tiles={tiles}
      palette={palette}
    />
  ) : null;
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
  frame: PropTypes.string,
  lockFrame: PropTypes.bool.isRequired,
};

ImageRender.defaultProps = {
  hashes: null,
  frame: null,
  reportTileCount: () => {},
};

export default ImageRender;
