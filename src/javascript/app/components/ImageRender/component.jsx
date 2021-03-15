import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import GameBoyImage from '../GameBoyImage';

const ImageRender = ({
  hash,
  hashes,
  images,
  frame,
  lockFrame,
  invertPalette,
  palette,
  loadImageTiles,
  reportTileCount,
}) => {
  const [tiles, setTiles] = useState(null);

  useEffect(() => {
    // setTiles(null); // no need to clear before update?
    loadImageTiles({ images })({ hash, frame, hashes })
      .then((loadedTiles) => {
        reportTileCount(loadedTiles.length);
        setTiles(loadedTiles);
      });
  }, [images, loadImageTiles, reportTileCount, hash, hashes, frame]);

  return tiles ? (
    <GameBoyImage
      lockFrame={lockFrame}
      invertPalette={invertPalette}
      tiles={tiles}
      palette={palette}
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
  images: PropTypes.array.isRequired,
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
